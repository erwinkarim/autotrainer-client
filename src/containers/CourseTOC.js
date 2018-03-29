import React, { Component } from 'react';
import { Jumbotron, Container, Row, Col } from 'reactstrap';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import CTOC from '../components/CTOC';
import { invokeApig } from '../libs/awsLibs';
import config from '../config';
import Notice from '../components/Notice';
import CourseMenu from '../components/CourseMenu';

/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
export default class CourseTOC extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { course: null, enrolment: null, loading: true };
  }
  componentDidMount = async () => {
    /*
      additional checks:
      1. see if you are enrolled in the course
    */

    // load the course here
    const handle = this;
    try {
      const result = await this.getCourse();
      if (result != null) {
        handle.setState({ course: result, loading: false });
      }
    } catch (e) {
      console.log(e);
    }

    try {
      const result = await this.getEnrolment();
      this.setState({ enrolment: result });
    } catch (e) {
      console.log('enrolment not found');
      console.log('ignore this if you own this course');
      console.log(e);
    }
  }
  getCourse = () => invokeApig({ path: `/courses/${this.props.match.params.id}` })
  getEnrolment = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    path: `/enrolment/${this.props.match.params.id}`,
  })
  render = () => {
    // loading screen
    if (this.state.loading) {
      return <Notice content="Course is loading ..." />;
    }

    // course not found
    if (this.state.course === null) {
      return <Notice content="Course not found ..." />;
    }

    const bgStyling = this.state.course.bg_pic ?
      { backgroundImage: `url(${this.state.course.bg_pic})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } :
      null;
    const titleFontStyling = this.state.course.title_font_color ?
      { color: this.state.course.title_font_color } : { color: 'black' };
    let styling = Object.assign({}, bgStyling);
    styling = Object.assign(styling, titleFontStyling);

    return (
      <div>
        <Helmet>
          <title>{this.state.course.name}/TOC - {config.site_name}</title>
        </Helmet>
        <Container>
          <Row><Col><CourseMenu courseId={this.props.match.params.id} /></Col></Row>
        </Container>
        <Jumbotron fluid style={styling}>
          <Container>
            <h1 className="display-3">Welcome to {this.state.course.name}</h1>
            <p className="lead">{this.state.course.tagline}</p>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <div className="col-12">
              <h3 className="display-4">Executive Summary</h3>
              { this.state.course.description.split('\n').map(para => (<p key={parseInt(Math.random() * 1000, 10)} className="lead text-left">{para}</p>)) }
            </div>
            <div className="col-12">
              <h3 className="display-4">Table of Contents</h3>
              <CTOC
                {...this.state}
                {...this.props}
                showLink
                enrolment={this.state.enrolment}
              />
            </div>
            { /*
              <div className="col-12">
                <h2 className="display-4">Additional Resources</h2>
                <ul className="text-left">
                  <li>Should show list of tables/images/etc</li>
                { Array.from(Array(randomInt(3,8)).keys()).map( (e,i) => {
                  return (<li key={i}>{ loremIpsum()}</li>);
                })}
                </ul>
              </div>
            */ }
          </Row>
        </Container>
      </div>
    );
  }
}

CourseTOC.propTypes = {
  match: PropTypes.shape().isRequired,
};
