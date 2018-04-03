/*
 * Component to load common services for building modules (docs, etc)
 * such common services is loading, updating and switching between modules
 */

import React, { Component } from 'react';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Button, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import toTitleCase from 'titlecase';
import PropTypes from 'prop-types';
import ModuleRootEditor from '../components/ModuleRootEditor';
import Notice from '../components/Notice';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';
import ArticleBuilder from '../modules/ArticleBuilderDumb';

/**
 * Adds two numbers together.
 * @param {int} prevProps The first number.
 * @returns {int} The sum of the two numbers.
 */
export default class ModuleBuilder extends Component {
  /**
   * Adds two numbers together.
   * @param {shape} props The first number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      module: null, loading: false,
    };
  }
  componentDidMount = () => {
    this.loadModule();
  }
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
  updateModule = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    method: 'PUT',
    path: `/modules/${this.props.match.params.moduleId}`,
    body: this.state.article,
    queryParams: { courseId: this.props.match.params.courseId },
  })
  handleUpdate = async () => {
    // should update module

    // check if the body is valid
    if (!this.moduleHandle.validBody()) {
      this.props.addNotification('Module body is empty', 'danger');
      return;
    }

    // now things are properly valid
    try {
      await this.updateModule();
      this.props.addNotification('Module updated', 'success');
    } catch (e) {
      console.log('error updating module');
      console.log(e);
    }
  }
  handleChange = (e) => {
    // should update the title, description
    const newModule = this.state.module;
    newModule[e.target.id] =
      e.target.id === 'title' ? toTitleCase(e.target.value) :
        e.target.value;
    this.setState({ module: newModule });
  }
  handleBodyUpdate = (body) => {
    // update body state here
    const newModule = this.state.module;
    newModule.body = body;

    this.setState({ module: newModule });
  }
  validateForm = () => this.state.module.title.length > 0 &&
    this.state.module.description.length > 0
  loadModule = async () => {
    // should load/reload the module
    this.setState({ module: null, loading: true });
    try {
      const result = await this.getModule();
      this.setState({ module: result, loading: false });
    } catch (e) {
      console.log('error getting module');
      console.log(e);
    }
  }
  render = () => {
    // check auth
    if (!this.props.isAuthenticated) {
      return (<Notice content="User is not authenticated." />);
    }

    if (this.state.loading) {
      return <Notice content="Module is loading ..." />;
    }

    if (this.state.module === null) {
      return (<Notice content="Module not loaded..." />);
    }

    const { courseId } = this.props.match.params;
    const { moduleType } = this.state.module;

    /*
      build layout based on moduleType
      each Module type must pass
      * this.state.module   = the current module state
      * handleBodyUpdate    = fn to update the modue.body
      each Module must ref itself to the this.moduleHandle
      * validBody will be checked on the module itself
      each module must implement the validBody method which returns a bool
    */

    let layout = null;
    if (moduleType === 'article') {
      layout = (
        <ArticleBuilder
          ref={(input) => { this.moduleHandle = input; }}
          module={this.state.module}
          handleBodyUpdate={this.handleBodyUpdate}
        />);
    }

    return (
      <Container className="mt-2 text-left">
        <Helmet>
          <title>{`Building ${this.state.module.title} - ${config.site_name}`}</title>
        </Helmet>
        <Row>
          <Col xs="12">
            <Breadcrumb>
              <BreadcrumbItem><Link href="/" to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link href="/" to="/welcome">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem><Link href="/" to={`/user/course_builder/${courseId}`}>Course Builder: {this.state.module.courseMeta.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Article Builder: {this.state.module.title}</BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <ModuleRootEditor module={this.state.module} handleChange={this.handleChange} />
        </Row>
        { layout }
        <Row>
          <FormGroup>
            <Button color="primary" className="mr-2" onClick={this.handleUpdate} disabled={!this.validateForm()}>Update</Button>
            <Button color="danger">Cancel</Button>
          </FormGroup>
        </Row>
      </Container>
    );
  }
}

ModuleBuilder.propTypes = {
  match: PropTypes.shape().isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape().isRequired,
  addNotification: PropTypes.func.isRequired,
};
