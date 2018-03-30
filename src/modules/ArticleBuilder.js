import React, { Component } from 'react';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, FormGroup, Button, Label, Card } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import toTitleCase from 'titlecase';
import Helmet from 'react-helmet';
import ModuleRootEditor from '../components/ModuleRootEditor';
import config from '../config';
import Notice from '../components/Notice';
import { invokeApig } from '../libs/awsLibs';
import Editor from '../components/Editor';

/*
  TODO:
    * table support
    * step-by-step accordion support
*/

/**
 * Adds two numbers together.
 * @param {int} e The first number.
 * @returns {int} The sum of the two numbers.
 */
export default class ArticleBuilder extends Component {
  /**
   * Adds two numbers together.
   * @param {int} props The first number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { article: null, loading: true };
  }
  componentDidMount = async () => {
    const handle = this;

    // get the article
    try {
      const result = await this.getArticle();

      if (result.body === undefined) {
        result.body = '';
      }

      // this will break older version
      // need to figure out how to handle this gracefully
      handle.setState({ article: result, loading: false });
      this.editor.setEditorStateFromRaw(result.body);
    } catch (e) {
      console.log('error getting the article');
      console.log(e);
    }
  }
  getArticle = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: `/modules/${this.props.match.params.moduleId}`,
    queryParams: { courseId: this.props.match.params.courseId },
  })
  handleChange = (e) => {
    const newArticle = this.state.article;
    newArticle[e.target.id] =
      e.target.id === 'title' ? toTitleCase(e.target.value) :
        e.target.value;
    this.setState({ article: newArticle });
  }
  handleUpdate = async () => {
    // send update then view the module
    console.log('attempt to update article');

    // set the state body to raw first
    // this.state.article.body = editorStateToJSON(this.state.editorState);
    this.state.article.body = this.editor.getRaw();

    // sanity check at update level
    if (!this.editor.hasText()) {
      this.props.addNotification('Article is empty.', 'danger');
      return;
    }

    try {
      await this.updateArticle();
      this.props.addNotification('Article updated ...');
      console.log('Sucessfully update article.');
    } catch (err) {
      console.log('error in updating the article');
      console.log(err);
    }
  }
  updateArticle = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    method: 'PUT',
    path: `/modules/${this.props.match.params.moduleId}`,
    body: this.state.article,
    queryParams: { courseId: this.props.match.params.courseId },
  })
  validateForm = () => this.state.article.title.length > 0 &&
    this.state.article.description.length > 0
  render =() => {
    // check auth
    if (!this.props.isAuthenticated) {
      return (<Notice content="User is not authenticated." />);
    }

    if (this.state.loading) {
      return <Notice content="Article is loading ..." />;
    }

    if (this.state.article === null) {
      return (<Notice content="Article not loaded..." />);
    }

    const { courseId } = this.props.match.params;

    return (
      <Container className="mt-2 text-left">
        <Helmet>
          <title>{`Building ${this.state.article.title} - ${config.site_name}`}</title>
        </Helmet>
        <Row>
          <Col xs="12">
            <Breadcrumb>
              <BreadcrumbItem><Link href="/" to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link href="/" to="/welcome">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem><Link href="/" to={`/user/course_builder/${courseId}`}>Course Builder: {this.state.article.courseMeta.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Article Builder: {this.state.article.title}</BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <ModuleRootEditor module={this.state.article} handleChange={this.handleChange} />
          <Col
            xs={{ size: 11, offset: 1 }}
            sm={{ size: 12, offset: 0 }}
            lg={{ size: 8, offset: 0 }}
          >
            <FormGroup>
              <Label>Article Body</Label>
              <Card className="p-3">
                <Editor ref={(editor) => { this.editor = editor; }} />
              </Card>
            </FormGroup>
            <FormGroup>
              <Button color="primary" className="mr-2" onClick={this.handleUpdate} disabled={!this.validateForm()}>Update</Button>
              <Button color="danger">Cancel</Button>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

ArticleBuilder.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      moduleId: PropTypes.string,
      courseId: PropTypes.string,
    }),
  }).isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
  }),
  addNotification: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

ArticleBuilder.defaultProps = {
  currentUser: {},
};
