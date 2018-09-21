import React, { Component } from 'react';
import {
  Row, Col, Nav, Navbar, Input, Button, UncontrolledDropdown, DropdownToggle,
  DropdownMenu, DropdownItem, Alert, CardColumns, Card, CardBody, CardTitle,
  CardText,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Sticky from 'react-sticky-el';
import toTitleCase from 'titlecase';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';

import { invokeApig, s3Delete } from '../../libs/awsLibs';
import config from '../../config';

const ModuleCard = (props) => {
  const e = props.module;
  const i = props.moduleIndex;
  const titleCaseType = toTitleCase(e.moduleType);
  return (
    <Card className="mb-2">
      <CardBody>
        <CardTitle> Module {i + 1}: {e.title} </CardTitle>
        <CardText>{e.description}</CardText>
        <CardText>Order:
          <Input type="select" value={e.order} onChange={props.handleOrderUpdate} data-module-id={e.moduleId}>
            {
              props.modules.map(module =>
                <option key={module.moduleId} value={module.order}>{module.order}</option>)
            }
          </Input>
        </CardText>
        <CardText>Publish status: {e.publish_status}</CardText>
        <Button className="mr-2 mb-2" color="primary" tag={Link} to={`/courses/${e.moduleType}/${e.courseId}/${e.moduleId}`}>View {titleCaseType}</Button>
        <Button className="mr-2 mb-2" color="info" tag={Link} to={`/user/builder/${e.courseId}/${e.moduleId}`}>Edit {titleCaseType}</Button>
        <Button className="mr-2 mb-2" type="button" color="danger" data-index={i} onClick={props.handleDeleteModule}>Delete {titleCaseType}</Button>
      </CardBody>
    </Card>
  );
};

ModuleCard.propTypes = {
  module: PropTypes.shape().isRequired,
  modules: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  moduleIndex: PropTypes.number.isRequired,
  handleOrderUpdate: PropTypes.func.isRequired,
  handleDeleteModule: PropTypes.func.isRequired,
};

/**
 * Adds two numbers together.
 * @param {shape} courseId the course ID
 * @param {shape} moduleId the Module ID
 * @param {shape} e event
 * @returns {JSX} the common builder
 */
export default class CourseModules extends Component {
  /**
   * Adds two numbers together.
   * @param {shape} props event
   * @returns {JSX} the common builder
   */
  constructor(props) {
    super(props);
    this.state = {
      modules: [], publish_status: 'all', showOrderChangedBanner: false, orig_modules: null, updating_order: false,
    };
  }
  componentDidMount = async () => {
    /*
    try {
      const results = await this.getModules();
      this.setState({ modules: results });
    } catch (e) {
      console.log('error getting modules');
      console.log(e);
    }
    */
    const { courseId } = this.props.course;
    const { publish_status } = this.state;

    API.get('default', '/modules', { queryStringParameters: { courseId, publish_status } })
      .then((res) => {
        this.setState({ modules: res });
      })
      .catch((err) => {
        console.log('error getting modules');
        console.log(err);
      });
  }
  getModuleDetail = (courseId, moduleId) => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: `/modules/${moduleId}`,
    queryParams: { courseId },
  })
  getModules = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: '/modules',
    queryParams: {
      courseId: this.props.course.courseId, publish_status: this.state.publish_status,
    },
  })
  handleRevertModuleOrder = () => {
    // console.log('should revert to original');
    this.setState({
      modules: JSON.parse(JSON.stringify(this.state.orig_modules)),
      orig_modules: null,
      showOrderChangedBanner: false,
    });
  }
  orderUpdate = () => invokeApig({
    method: 'POST',
    path: `/courses/${this.props.course.courseId}/reorder_modules`,
    body: {
      new_order: this.state.modules.map(e => ({ moduleId: e.moduleId, order: e.order })),
    },
  })
  togglePublishStatus = async () => {
    let newPublishStatus = this.state.publish_status;
    newPublishStatus = newPublishStatus === 'all' ? 'published' : 'all';

    try {
      await this.setState({ publish_status: newPublishStatus });
      const newModules = await this.getModules();
      this.setState({ modules: newModules });
    } catch (e) {
      console.log('error refreshing modules');
      console.error(e);
    }
  }
  confirmOrderUpdate = async () => {
    this.setState({ updating_order: true });
    /*
      get each of the module the moduleId and new ordering info
      invoke API to get the new order
      reload the modules
    */
    try {
      const result = await this.orderUpdate();
      this.setState({
        modules: result, orig_modules: null, showOrderChangedBanner: false, updating_order: false,
      });
      this.props.addNotification('Modules re-ordered', 'success');
    } catch (e) {
      console.log('error updating module orders');
      console.log(e);
    }
  }
  handleOrderUpdate = (e) => {
    /*
      plan,
      1. find out which module order the update and get the current ordering
      2. splice and put the currently selected module in the array
      3. update the ordering at state level
      4. put up a banner showing order has change and needs confirmation to update it
    */
    if (!this.state.orig_modules) {
      this.setState({ orig_modules: JSON.parse(JSON.stringify(this.state.modules)) });
    }

    const newModuleOrder = this.state.modules.sort((a, b) => a.order > b.order);
    const moduleIndex = newModuleOrder.findIndex(elm => elm.moduleId === e.target.dataset.moduleId);
    const newModuleIndex = newModuleOrder.findIndex(elm => elm.moduleId > e.target.value);
    const moduleInfo = newModuleOrder.splice(moduleIndex, 1);
    newModuleOrder.splice(newModuleIndex, 0, moduleInfo[0]);
    newModuleOrder.forEach((elm, i) => {
      const newElm = elm;
      newElm.order = i + 1;
    });

    this.setState({ modules: newModuleOrder, showOrderChangedBanner: true });
  }
  deleteModule = (courseId, moduleId) => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    method: 'DELETE',
    path: `/modules/${moduleId}`,
    queryParams: { courseId },
  })
  handleDeleteModule = async (e) => {
    if (!window.confirm('Really delete?')) {
      return;
    }

    const handle = this;
    const moduleIndex = e.target.dataset.index;
    const module = this.state.modules[moduleIndex];
    try {
      /*
        if the module is a file, also delete the file
        issues if the old version is not there. like, there's no key
      */
      if (module.moduleType === 'doc') {
        const result = await this.getModuleDetail(module.courseId, module.moduleId);
        console.log(`attempt to delete ${result.body.key}`);
        await s3Delete(result.body.key);
      }
      await this.deleteModule(module.courseId, module.moduleId);
      const newModules = this.state.modules;
      newModules.splice(moduleIndex, 1);
      handle.setState({ modules: newModules });
    } catch (err) {
      console.log('error in deleting module');
      console.log(err);
    }
  }
  createModule = (type, courseId) => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: '/modules',
    method: 'POST',
    body: {
      courseId, title: `New ${type}`, description: `Content for new ${type}`, moduleType: type, order: this.state.modules.length + 1,
    },
  })
  handleCreateModule = async (e) => {
    // creat the module based on type then go to the appropite module builder
    const moduleType = e.target.dataset.type;
    const { courseId } = this.props.course;
    console.log(`create new ${moduleType} for course ${courseId}`);

    API.post('default', '/modules', {
      body: {
        courseId, title: `New ${moduleType}`, description: `Content for new ${moduleType}`, moduleType, order: this.state.modules.length + 1,
      },
    })
      .then((res) => {
        this.props.history.push(`/user/builder/${res.courseId}/${res.moduleId}`);
      })
      .catch((err) => {
        this.props.addNotification('Problem creating a new module');
        console.log('error creating a new module');
        console.log(err);
      });
    /*
    try {
      const result = await this.createModule(moduleType, courseId);
      handle.props.history.push(`/user/builder/${result.courseId}/${result.moduleId}`);
    } catch (err) {
      this.props.addNotification('Problem creating a new module');
      console.log('error creating a new module');
      console.log(err);
    }
    */
  }
  render = () => (
    <Row className="mt-3">
      <div className="col-12">
        <h3>Module Manager</h3>
        <hr />
        <Navbar color="light" light>
          <Nav>
            <UncontrolledDropdown tag="li" className="nav-item">
              <DropdownToggle caret nav>New</DropdownToggle>
              <DropdownMenu>
                <DropdownItem data-type="article" onClick={this.handleCreateModule}>Article</DropdownItem>
                <DropdownItem data-type="quiz" onClick={this.handleCreateModule}>Quiz</DropdownItem>
                <DropdownItem data-type="doc" onClick={this.handleCreateModule}>Document</DropdownItem>
                <DropdownItem data-type="video" onClick={this.handleCreateModule}>Video</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown>
              <DropdownToggle caret nav>Filter</DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.togglePublishStatus}><FontAwesomeIcon icon={this.state.publish_status === 'all' ? 'square' : 'check-square'} />Published Only</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Navbar>
        <hr />
      </div>
      {
        /* showing confirmation dialog when order changed */
        this.state.showOrderChangedBanner ? (
          <div className="col-12">
            <Sticky style={{ zIndex: 200 }} stickyClassName="sticky-class">
              <Alert color="info">Order has been change. Confirm update?
                <Button outline color="primary" className="mx-2" onClick={this.confirmOrderUpdate} disabled={this.state.updating_order}>Yes</Button>
                <Button outline color="danger" onClick={this.handleRevertModuleOrder} disabled={this.state.updating_order}>No</Button>
              </Alert>
            </Sticky>
          </div>
        ) : null
      }
      {
        this.state.modules.length === 0 ? (
          <Col><Row><p>No Modules</p></Row></Col>
        ) : (
          <Col>
            <CardColumns>{
              this.state.modules.sort((a, b) =>
                parseInt(a.order, 10) > parseInt(b.order, 10)).map((e, i) => (
                  <ModuleCard
                    key={e.moduleId}
                    handleOrderUpdate={this.handleOrderUpdate}
                    handleDeleteModule={this.handleDeleteModule}
                    module={e}
                    moduleIndex={i}
                    modules={this.state.modules}
                  />
                ))
            }
            </CardColumns>
          </Col>
        )
      }
    </Row>
  )
}

CourseModules.propTypes = {
  course: PropTypes.shape().isRequired,
  addNotification: PropTypes.func.isRequired,
};
