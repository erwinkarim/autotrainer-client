import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Jumbotron } from 'reactstrap';
import Waypoint from 'react-waypoint';
import Helmet from 'react-helmet';
import './Article.css';
import { invokeApig } from '../libs/awsLibs';
import Notice from '../components/Notice';
import config from '../config';
import Editor from '../components/Editor';
import CourseMenu from '../components/CourseMenu';

/**
 * Module describe the article
 * @returns {Object}    the article
 */
export default class Article extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { article: null, enrolment: null, loading: true };
  }
  componentDidMount = async () => {
    const handle = this;
    let result = null;

    try {
      result = await this.loadArticle();
      this.setState({ article: result, loading: false });
    } catch (e) {
      console.log('error fetching article');
      console.log(e);
    }

    // get enrolment status
    try {
      result = await this.getEnrolment();
      handle.setState({ enrolment: result });

      // setup the editor once enrolment is confirmed
      this.editor.setEditorStateFromRaw(this.state.article.body);
    } catch (e) {
      console.log('error getting enrolment status');
      console.log('ignore if you own this course');
      console.log(e);
    }
  }
  getEnrolment = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    path: `/enrolment/${this.state.article.courseId}`,
  })
  loadArticle = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: `/modules/${this.props.match.params.articleId}`,
    queryParams: { courseId: this.props.match.params.courseId },
  });
  handleEnterViewport = async () => {
    const handle = this;
    console.log('should trigger class attended');
    /*
      1. check if progress has already been made
      2. send progress updates if necessary
    */
    if (this.state.enrolment !== null) {
      // check if you already attend this article
      if (!handle.state.enrolment.progress.includes(handle.state.article.moduleId)) {
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
  notifyProgress = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    method: 'POST',
    path: `/enrolment/${this.state.article.courseId}/attend/${this.state.article.moduleId}`,
    body: {},
  })
  render = () => {
    if (this.state.loading) {
      return (<Notice content="Article is loading ..." />);
    }

    if (this.props.currentUser === null) {
      return (<Notice title="Unauthorized" content="You have not logged in yet ..." />);
    }

    if (this.state.article === null) {
      return (<Notice content="Loading article ..." />);
    }

    /*
      ignore this is you are the owner ...
    */
    if (this.state.enrolment === null) {
      return (<Notice content="You are not enrolled in this course ..." />);
    }

    /*
      TODO: make sure the accordion works
    */
    const { article } = this.state;
    return (
      <div className="text-left">
        <Helmet>
          <title>{ this.state.article.title } - {config.site_name}</title>
        </Helmet>
        <Container>
          <Row>
            <Col>
              <CourseMenu courseId={article.courseId} moduleId={article.moduleId} />
            </Col>
          </Row>
        </Container>
        <Jumbotron fluid>
          <Container>
            <h4 className="display-4">Chapter {article.order}: {article.title}</h4>
            <p className="lead">{article.description}</p>
          </Container>
        </Jumbotron>
        <Container>
          { /* actual */}
          <Row>
            <div className="col-12 col-md-8 text-justify">
              <Editor ref={(editor) => { this.editor = editor; }} readOnly />
            </div>
          </Row>
        </Container>

        <Waypoint onEnter={this.handleEnterViewport} />
      </div>
    );
  }
}

Article.propTypes = {
  addNotification: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      articleId: PropTypes.string,
      courseId: PropTypes.string,
    }),
  }).isRequired,
};
