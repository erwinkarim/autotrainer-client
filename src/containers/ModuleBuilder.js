/*
 * Component to load common services for building modules (docs, etc)
 * such common services is loading, updating and switching between modules
 */

import React, { Component } from 'react';
import { Row, Button, FormGroup, Input, Col } from 'reactstrap';
import Helmet from 'react-helmet';
import toTitleCase from 'titlecase';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';

import ModuleRootEditor from '../components/ModuleRootEditor';
import Notice from '../components/Notice';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';
import asyncComponent from '../components/AsyncComponent';

const ArticleBuilder = asyncComponent(() => import('../modules/ArticleBuilder'));
const VideoBuilder = asyncComponent(() => import('../modules/VideoBuilder'));
const DocBuilder = asyncComponent(() => import('../modules/DocBuilder'));
const QuizBuilder = asyncComponent(() => import('../modules/QuizBuilder'));

const defaultModule = { title: '', description: '', moduleType: null };
const defaultCountDown = 30;
/**
 * Adds two numbers together.
 * @param {int} e Event Object
 * @param {int} prevProps Previous Property
 * @param {int} body module.body to be updated
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
      module: defaultModule, loading: false, updating: false, countDown: 0,
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
    body: this.state.module,
    queryParams: { courseId: this.props.match.params.courseId },
  })
  handleUpdate = async () => {
    // should update module
    let isValidBody = false;
    try {
      isValidBody = await this.moduleHandle.theRef.validBody();
    } catch (e) {
      console.log('error awaiting validBody');
      console.log(e);
    }

    // check if the body is valid
    if (!isValidBody) {
      this.props.addNotification('Module body is empty', 'danger');
      return;
    }

    // now things are properly valid
    try {
      this.setState({ updating: true });
      await this.updateModule();
      this.props.addNotification('Module updated', 'success');
      this.setState({ updating: false });
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
    this.setState({ module: defaultModule, loading: true });
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

    if (this.state.loading) {
      layout = <Notice content="Module is loading ..." />;
    } else if (moduleType === null || moduleType === undefined) {
      layout = (<Notice content="Module not loaded..." />);
    } else if (moduleType === 'article') {
      layout = (
        <ArticleBuilder
          ref={(input) => { this.moduleHandle = input; }}
          module={this.state.module}
          handleBodyUpdate={this.handleBodyUpdate}
        />);
    } else if (moduleType === 'video') {
      layout = (
        <VideoBuilder
          ref={(input) => { this.moduleHandle = input; }}
          module={this.state.module}
          handleBodyUpdate={this.handleBodyUpdate}
        />);
    } else if (moduleType === 'doc') {
      layout = (
        <DocBuilder
          ref={(input) => { this.moduleHandle = input; }}
          module={this.state.module}
          handleBodyUpdate={this.handleBodyUpdate}
        />);
    } else if (moduleType === 'quiz') {
      layout = (
        <QuizBuilder
          ref={(input) => { this.moduleHandle = input; }}
          module={this.state.module}
          handleBodyUpdate={this.handleBodyUpdate}
        />);
    }

    return (
      <div className="mt-2 text-left">
        <Helmet>
          <title>{`Building ${this.state.module.title} - ${config.site_name}`}</title>
        </Helmet>
        <Row>
          <Col xs="12" md="8">
            <FormGroup>
              <Input size="sm" type="text" disabled value={`Last saved on DD-MMM-YYYY HH:SSa. Save changes in ${this.state.countDown}`} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <ModuleRootEditor {...this.state} handleChange={this.handleChange} />
        </Row>
        { layout }
        <Row>
          <FormGroup>
            <Button color="primary" className="mr-2" onClick={this.handleUpdate} disabled={!this.validateForm() || this.state.updating}>
              { this.state.updating ? <span><FontAwesome spin name="cog" /> Updating</span> : 'Update'}
            </Button>
            <Button color="danger" tag={Link} to={`/user/builder/${this.state.module.courseId}`}>Cancel</Button>
          </FormGroup>
        </Row>
      </div>
    );
  }
}

ModuleBuilder.propTypes = {
  match: PropTypes.shape().isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  addNotification: PropTypes.func.isRequired,
};
