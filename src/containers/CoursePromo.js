import React, { Component } from 'react';
import { Container, Jumbotron, Row, CardDeck, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import AWS from 'aws-sdk/global';
import { invokeApig, getUnauthCredentials } from '../libs/awsLibs';
import config from '../config';
import CTOC from '../components/CTOC';
import Notice from '../components/Notice';
import './CoursePromo.css';
import Editor from '../components/Editor';

/* button to enrol or show TOC */
const EnrolButton = (props) => {
  const {
    course,
    enrolText,
    enrolledText,
    enrolment,
  } = props;

  // check enrolment status
  // point to enrolment payment page if no enrolment yet
  return enrolment === null ?
    (<Button color="primary" tag={Link} to={`/courses/enrol/${course.courseId}`}>{enrolText}</Button>) :
    (<Button tag={Link} to={`/courses/toc/${props.course.courseId}`}>{enrolledText}</Button>);
};

EnrolButton.propTypes = {
  enrolText: PropTypes.string,
  enrolledText: PropTypes.string,
  enrolment: PropTypes.shape(),
  course: PropTypes.shape().isRequired,
};

EnrolButton.defaultProps = {
  enrolText: 'Enrol',
  enrolledText: 'Table of Contents',
  enrolment: {},
};

const RecentCustomers = props => (
  <Container>
    <Row>
      <div className="col-12 mb-2">
        <h2 className="display-4 text-center">Recent Customers</h2>
      </div>
      {
        props.clientList.map(e => (
          <div className="col-3 col-md-2 mb-2" key={e}>
            <img alt={e} className="img-fluid img-grayscale" src={`${process.env.PUBLIC_URL}/logos/${e}`} />
          </div>
        ))
       }
    </Row>
  </Container>
);

RecentCustomers.propTypes = {
  clientList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

/**
 * Adds two numbers together.
 * @param {int} e The first number.
 * @param {int} courseId The first number.
 * @returns {int} The sum of the two numbers.
 */
export default class CoursePromo extends Component {
  /**
   * Adds two numbers together.
   * @param {int} props The first number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      course: null, enrolment: null, loading: true,
    };
  }
  componentDidMount = async () => {
    if (AWS.config.credentials === null) {
      console.log('should get Unauthenticated creds');
      try {
        await getUnauthCredentials();
      } catch (e) {
        console.log('error getting Unauthenticated creds');
        console.log(e);
      }
    }

    // load the course and enrolment status
    const handle = this;
    try {
      const result = await this.getCourse();
      if (result != null) {
        handle.setState({ course: result, loading: false });
      }
    } catch (e) {
      // throw new Error(e);
      this.setState({ course: null, loading: false });
      console.log(e);
    }

    // skip enrolment if there's no current user
    if (this.props.currentUser === null) {
      return;
    }

    if (this.props.demoMode) {
      // no enrolment for demo mode
      return;
    }

    try {
      const enrolmentStatus = await this.getEnrolmentStatus();
      this.setState({ enrolment: enrolmentStatus });
    } catch (e) {
      console.log(e);
      if (e.error === 'Item not found') {
        console.log('item not found');
      }
    }

    // display the promo content or description depending on availability
    if (this.editor) {
      this.editor
        .setEditorStateFromRaw(this.state.course.promoContent || this.state.course.description);
    }
  }
  getCourse = () => {
    const courseId = this.props.demoMode ?
      this.props.courseId :
      this.props.match.params.id;
    console.log(`requesting courseId ${courseId}`);
    return invokeApig({ path: `/courses/${courseId}` });
  }
  getEnrolmentStatus = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    path: `/enrolment/${this.props.match.params.id}`,
  })
  handleEnrolCourse = async (e) => {
    if (this.props.demoMode) {
      // do nothing in demo mode
      return;
    }

    // console.log('should enrol for course');
    try {
      const result = await this.enrolCourse(e.target.dataset.course);
      this.setState({ enrolment: result });
      this.props.addNotification('Course enrolled');
    } catch (err) {
      console.log('problems trying to enrol course');
      console.log(err);
    }
  }
  enrolCourse = courseId => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    method: 'POST',
    path: '/enrolment',
    body: { courseId, enrolmentContext: 'email', email: this.props.currentUser.email },
  })
  render = () => {
    if (this.state.loading) {
      return <Notice content="Loading course ..." />;
    }

    if (this.state.course === null || this.state.course === undefined) {
      return <Notice content="Course not found..." />;
    }

    const bgStyling = this.state.course.bg_pic ?
      { backgroundImage: `url(${this.state.course.bg_pic})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } :
      null;
    const titleFontStyling = this.state.course.title_font_color ?
      { color: this.state.course.title_font_color } : { color: 'black' };
    let styling = Object.assign({}, bgStyling);
    styling = Object.assign(styling, titleFontStyling);

    let clientList = null;
    if (this.state.course.clientList) {
      if (this.state.course.clientList.length > 0) {
        clientList = <RecentCustomers clientList={this.state.course.clientList} />;
      }
    }

    return (
      <div>
        <Helmet>
          <title>{this.state.course.name} - {config.site_name}</title>
        </Helmet>
        <Jumbotron fluid style={styling}>
          <Container>
            <h1 className="display-3 text-center course-promo-title">{this.state.course.name}</h1>
            { this.state.course.tagline !== undefined ? (<p className="lead">{this.state.course.tagline}</p>) : null}
            <p>
              <EnrolButton
                id="course-enrol-button-1"
                outline
                {...this.state}
                {...{ enrolText: `Enrol for RM${this.state.course.price}`, handleEnrolCourse: this.handleEnrolCourse }}
                {...{
                  auth: this.props.auth,
                  isAuthenticated: this.props.isAuthenticated,
                  addNotification: this.props.addNotification,
                  }
                }
              />
            </p>
          </Container>
        </Jumbotron>
        <Container>
          {
            (this.state.course.key_points === undefined ||
              this.state.course.key_points === null) ? null : (
                <Row>
                  <div className="col-12 mb-2">
                    <CardDeck>
                      {
                        this.state.course.key_points.map(e => (
                          <Card key={e.title}>
                            <CardBody>
                              <CardTitle className="text-center">{e.title}</CardTitle>
                              <CardText>{e.subtext}</CardText>
                            </CardBody>
                          </Card>
                        ))
                      }
                    </CardDeck>
                  </div>
                </Row>
            )
          }
        </Container>
        <Container>
          <Row>
            {
              this.state.course.promoContent ? (
                <Editor
                  className="course-promo-description col-12"
                  ref={(editor) => { this.editor = editor; }}
                  readOnly
                />
              ) : (
                <div className="col-12 text-center course-promo-description">
                  {
                    this.state.course.description.split('\n').map(e => (
                      <p className="lead" key={parseInt(Math.random() * 1000, 10)}>{e}</p>
                    ))
                  }
                  { /* Show put tag here */ }
                </div>
            )
          }
          </Row>
          <Row>
            <div className="col-12">
              <h4 className="display-4">Table of Contents</h4>
            </div>
            <CTOC course={this.state.course} enrolment={this.state.enrolment} promo className="course-toc" />
          </Row>
        </Container>
        { clientList }
        <Jumbotron fluid>
          <Container>
            <h1 className="display-3">Pricing</h1>
            <p className="lead">RM{this.state.course.price}</p>
            <div className="text-center">
              <EnrolButton
                id="course-enrol-button-2"
                {...this.state}
                {...{
                  auth: this.props.auth,
                  isAuthenticated: this.props.isAuthenticated,
                  addNotification: this.props.addNotification,
                  }
                }
                handleEnrolCourse={this.handleEnrolCourse}
                className="mx-auto"
              />
            </div>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

CoursePromo.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape(),
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  currentUser: PropTypes.shape(),
  auth: PropTypes.shape().isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  demoMode: PropTypes.bool,
  courseId: PropTypes.string,
};

CoursePromo.defaultProps = {
  currentUser: {},
  demoMode: false,
  courseId: '', // should be supplied when in demoMode
};
