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
import CourseBottomNav from '../components/CourseBottomNav';
import asyncComponent from '../components/AsyncComponent';

const CourseTOC = asyncComponent(() => import('../modules/CourseTOC'));
const Article = asyncComponent(() => import('../modules/Article'));
const Quiz = asyncComponent(() => import('../modules/Quiz'));
const Doc = asyncComponent(() => import('../modules/DocViewer'));
const Video = asyncComponent(() => import('../modules/Video'));
const CourseProgress = asyncComponent(() => import('../modules/CourseProgress'));

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
    const prevModuleId = this.props.demoMode ?
      prevProps.moduleId :
      prevProps.match.params.moduleId;
    const currentModuleId = this.props.demoMode ?
      this.props.moduleId :
      this.props.match.params.moduleId;
    // compare previous state w/ current state, and if the address changes
    // reload the module
    if (prevModuleId !== currentModuleId) {
      this.loadModule();
    }
  }
  getModule = () => {
    const moduleId = this.props.demoMode ?
      this.props.moduleId :
      this.props.match.params.moduleId;
    const courseId = this.props.demoMode ?
      this.props.courseId :
      this.props.match.params.courseId;

    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path: `/modules/${moduleId}`,
      queryParams: { courseId },
    });
  }
  getModuleListings = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: '/modules',
    queryParams: { courseId: this.props.match.params.courseId },
  })
  getCourse = () => {
    const courseId = this.props.demoMode ?
      this.props.courseId :
      this.props.match.params.courseId;

    return invokeApig({
      path: `/courses/${courseId}`,
    });
  }
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
    const moduleType = this.props.demoMode ?
      this.props.moduleType : this.props.match.params.moduleType;

    // the async fn to invoke apiGateway to get the module
    this.setState({ loading: true });
    try {
      let result = null;
      if (moduleType === 'toc') {
        result = await this.getCourse();
      } else if (moduleType === 'progress') {
        result = Object.assign(
          { title: 'Progress', description: 'Some description here' },
          { modules: (await this.getModuleListings()) },
        );
      } else {
        result = await this.getModule();
      }
      // const result = await
      // (this.props.match.params.moduleType === 'toc' ? this.getCourse() : this.getModule());
      this.setState({ loading: false, module: result });
    } catch (e) {
      console.log('error getting module');
      console.log(e);
    }
  }
  loadEnrolment = async () => {
    if (this.props.demoMode) {
      // skip if demo mode
      this.setState({ enrolment: { progress: [] } });
      return;
    }

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
    const { module, enrolment, loading } = this.state;
    const { demoMode, currentUser } = this.props;
    const courseId = this.props.demoMode ?
      this.props.courseId :
      this.props.match.params.courseId;
    const moduleId = this.props.demoMode ?
      this.props.moduleId :
      this.props.match.params.moduleId;
    const moduleType = this.props.demoMode ?
      this.props.moduleType :
      this.props.match.params.moduleType;
    let layout = null;

    // check of enrolment status
    if (enrolment === null && !demoMode) {
      return (<Notice content="You are not enrolled in this course ..." />);
    }

    // check if the user is logged in
    if (currentUser === null) {
      return (<Notice title="Unauthorized" content="You have not logged in yet ..." />);
    }

    // render the layout based on the moduleType / loading state ...
    if (loading) {
      layout = (<Notice content="Module is loading ..." />);
    } else if (module === null) {
      layout = (<Notice content="Module has no content ..." />);
    } else if (moduleType === 'toc') {
      layout = <CourseTOC {...this.state} />;
    } else if (moduleType === 'progress') {
      layout = <CourseProgress {...this.state} />;
    } else if (moduleType === 'article') {
      layout = <Article {...this.state} triggerAttendance={this.triggerAttendance} />;
    } else if (moduleType === 'quiz') {
      layout = <Quiz {...this.state} triggerAttendance={this.triggerAttendance} />;
    } else if (moduleType === 'doc') {
      layout = <Doc {...this.state} triggerAttendance={this.triggerAttendance} />;
    } else if (moduleType === 'video') {
      layout = <Video {...this.state} triggerAttendance={this.triggerAttendance} />;
    }

    const moduleJumbotron = (moduleType === 'toc' || moduleType === 'progress') ? null : (
      <Jumbotron fluid>
        <Container>
          <h4 className="display-4">Chapter {module.order}: {module.title}</h4>
          <p className="lead">{module.description}</p>
        </Container>
      </Jumbotron>
    );

    const pageTitle = module.title || module.name;

    return (
      <div className="text-left">
        <Helmet>
          <title>{pageTitle} - {config.site_name}</title>
        </Helmet>
        <Container>
          <Row>
            <Col>
              <CourseMenu courseId={courseId} moduleId={moduleId} {...this.state} {...this.props} />
            </Col>
          </Row>
        </Container>
        { moduleJumbotron }
        { layout }
        <Container className="mt-2">
          <Row>
            <Col>
              <CourseBottomNav
                courseId={courseId}
                moduleId={moduleId}
                moduleType={moduleType}
                demoMode={demoMode}
              />
            </Col>
          </Row>
        </Container>
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
  demoMode: PropTypes.bool,
  courseId: PropTypes.string, // to be used w/ demoMode
  moduleId: PropTypes.string, // to be used w/ demoMode
  moduleType: PropTypes.string, // to be used w/ demoMode
};

Module.defaultProps = {
  currentUser: null,
  demoMode: false,
  moduleType: '',
};
