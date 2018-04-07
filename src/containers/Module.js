/*
  this will be the place where we are going to build a common module component
  to load the module, course map and response to address changes

  after the module has been loaded, will put out the layout demanded by each
  module type (quiz, article, etc ...)
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Jumbotron } from 'reactstrap';
import Helmet from 'react-helmet';
import Notice from '../components/Notice';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';
import CourseMenu from '../components/CourseMenu';
import asyncComponent from '../components/AsyncComponent';

const CourseTOC = asyncComponent(() => import('../modules/CourseTOC'));
const Article = asyncComponent(() => import('../modules/Article'));
const Quiz = asyncComponent(() => import('../modules/Quiz'));
const Doc = asyncComponent(() => import('../modules/DocViewer'));
const Video = asyncComponent(() => import('../modules/Video'));

/**
 * Module
 * @param {json} nextProps the props
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
export default class Module extends Component {
  /**
   * Module
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      loading: true, module: { title: 'No Title' }, enrolment: null,
    };
  }
  componentDidMount = () => {
    // load the module
    this.loadModule();
    this.loadEnrolment();
  }
  /**
   * Module
   * @param {json} prevProps the props
   * @returns {null} The sum of the two numbers.
   */
  componentDidUpdate = (prevProps) => {
    // compare previous state w/ current state, and if the address changes
    // reload the module
    if (prevProps.match.params.moduleId !== this.props.match.params.moduleId) {
      this.loadModule();
    }
  }
  getModule = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: `/modules/${this.props.match.params.moduleId}`,
    queryParams: { courseId: this.props.match.params.courseId },
  })
  getCourse = () => invokeApig({
    path: `/courses/${this.props.match.params.courseId}`,
  })
  getEnrolment = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    path: `/enrolment/${this.props.match.params.courseId}`,
  })
  notifyProgress = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    method: 'POST',
    path: `/enrolment/${this.state.module.courseId}/attend/${this.state.module.moduleId}`,
    body: {},
  })
  loadModule = async () => {
    // the async fn to invoke apiGateway to get the module
    this.setState({ loading: true });
    try {
      const result = await (this.props.match.params.moduleType === 'toc' ? this.getCourse() : this.getModule());
      this.setState({ loading: false, module: result });
    } catch (e) {
      console.log('error getting module');
      console.log(e);
    }
  }
  loadEnrolment = async () => {
    try {
      const result = await this.getEnrolment();
      this.setState({ enrolment: result });
    } catch (e) {
      console.log('error getting enrolment status');
      console.log('ignore if you own this course');
      console.log(e);
    }
  }
  triggerAttendance = async () => {
    const handle = this;
    console.log('should trigger class attended');
    /*
      1. check if progress has already been made
      2. send progress updates if necessary
    */
    if (this.state.enrolment !== null) {
      // check if you already attend this article
      if (!handle.state.enrolment.progress.includes(handle.state.module.moduleId)) {
        try {
          // check attendance
          let result = await this.notifyProgress();

          this.props.addNotification('We remark that you have read this article');

          if (result.status === 0) {
            this.props.addNotification('Course complete. View your certificate at the landing page');
          }

          // update the erolment
          result = await this.getEnrolment();

          handle.setState({ enrolment: result });
        } catch (e) {
          console.log('error getting attendance');
          console.log(e);
        }
      } // if()
    }
  }
  render = () => {
    // check if the user is logged in
    if (this.props.currentUser === null) {
      return (<Notice title="Unauthorized" content="You have not logged in yet ..." />);
    }

    // check of enrolment status
    if (this.state.enrolment === null) {
      return (<Notice content="You are not enrolled in this course ..." />);
    }

    const { module } = this.state;
    const { courseId, moduleId } = this.props.match.params;
    let layout = null;

    // render the layout based on the moduleType / loading state ...
    if (this.state.loading) {
      layout = (<Notice content="Module is loading ..." />);
    } else if (this.state.module === null) {
      layout = (<Notice content="Module has no content ..." />);
    } else if (module.moduleType === 'article') {
      layout = <Article {...this.state} triggerAttendance={this.triggerAttendance} />;
    } else if (module.moduleType === 'quiz') {
      layout = <Quiz {...this.state} triggerAttendance={this.triggerAttendance} />;
    } else if (module.moduleType === 'doc') {
      layout = <Doc {...this.state} triggerAttendance={this.triggerAttendance} />;
    } else if (module.moduleType === 'video') {
      layout = <Video {...this.state} triggerAttendance={this.triggerAttendance} />;
    } else if (this.props.match.params.moduleType === 'toc') {
      layout = <CourseTOC {...this.state} />;
    }

    const moduleJumbotron = this.props.match.params.moduleType === 'toc' ? null : (
      <Jumbotron fluid>
        <Container>
          <h4 className="display-4">Chapter {module.order}: {module.title}</h4>
          <p className="lead">{module.description}</p>
        </Container>
      </Jumbotron>
    );

    const pageTitle = this.state.module.title || this.state.module.name;

    return (
      <div className="text-left">
        <Helmet>
          <title>{pageTitle} - {config.site_name}</title>
        </Helmet>
        <Container>
          <Row>
            <Col>
              <CourseMenu courseId={courseId} moduleId={moduleId} />
            </Col>
          </Row>
        </Container>
        { moduleJumbotron }
        { layout }
      </div>
    );
  }
}

Module.propTypes = {
  currentUser: PropTypes.shape(),
  addNotification: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      moduleType: PropTypes.string,
      moduleId: PropTypes.string,
      courseId: PropTypes.string,
    }),
  }).isRequired,
};

Module.defaultProps = {
  currentUser: null,
};
