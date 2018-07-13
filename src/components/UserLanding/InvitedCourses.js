import React, { Component } from 'react';
import { Row, Col, CardColumns, Card, CardImg, CardTitle, CardBody, CardText, Button } from 'reactstrap';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';
import Notice from '../../components/Notice';
import '../../containers/UserLanding.css';
import '../../containers/CertCheck.css';
import config from '../../config';
import { invokeApig } from '../../libs/awsLibs';

/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
export default class InvitedCourses extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      courses: [], isLoading: false,
    };
  }
  componentDidMount = async () => {
    // load invited courses
    this.setState({ isLoading: true });
    try {
      const result = await this.loadInvitedCourses();
      this.setState({ courses: result, isLoading: false });
    } catch (e) {
      console.log('error loading invited courses');
      console.log(e);
    }
  }
  loadInvitedCourses = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    path: '/enrolment/invited',
    queryParams: { email: this.props.email },
  })
  render = () => {
    if (this.state.isLoading) {
      return <Notice content="Loading courses invites ..." />;
    }

    return (
      <Row>
        <Col xs="12">
          <h3 id="invited"><span className="invited-courses">Invited Courses</span></h3>
          <hr />
        </Col>
        <Col xs="12">
          <CardColumns>
            {
              this.props.demoMode ? (
                <Card body className="invited-courses-card-demo">
                  <CardTitle tag="h2">Sample Course Name</CardTitle>
                  <CardText className="lead">This is a sample of a course for demonstration purpose</CardText>
                  <CardText>...</CardText>
                  <Button className="mr-2 mb-2" color="info">View</Button>
                </Card>
              ) : null
            }
            {
              this.state.courses.length === 0 ? (
                <Card body>
                  <CardText>You have not been invited to any courses yet ...</CardText>
                </Card>
              ) : (
                <div>{ this.state.courses.map(course => (
                  <Card key={course.courseId}>
                    <div style={{ overflow: 'hidden', height: '3em' }}>
                      <CardImg top src={course.bg_pic} />
                    </div>
                    <CardBody>
                      <CardTitle className="text-center" tag="h2">{ course.name }</CardTitle>
                      <CardText className="lead">{course.description.split('\n')[0]}</CardText>
                      { course.description.split('\n').length > 1 ? <CardText>...</CardText> : null }
                      <Button className="mr-2 mb-2" color="info" tag={Link} to={`/courses/promo/${course.courseId}`} >View</Button>
                    </CardBody>
                  </Card>))}
                </div>
              )
            }
          </CardColumns>
        </Col>
      </Row>
    );
  }
}

InvitedCourses.propTypes = {
  email: PropTypes.string.isRequired,
  demoMode: PropTypes.bool,
};

InvitedCourses.defaultProps = {
  demoMode: false,
};
