import React, { Component } from "react";
import { Container, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import { Navbar } from 'reactstrap';
import { FormGroup, Label,InputGroup, Input, InputGroupAddon, Button, Table }from 'reactstrap';
import { UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { Card, CardBody, CardTitle, CardText} from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import randomInt from 'random-int';
import toTitleCase from 'titlecase';
import FontAwesome from 'react-fontawesome';
import { invokeApig, s3Delete } from "../libs/awsLibs";
import Notice from '../components/Notice';
import Helmet from 'react-helmet';
import './CourseBuilder.css';
import config from '../config.js'

class CourseUser extends Component {
  constructor(props){
    super(props);
    this.state = {userDropdownOpen:false};

  }
  toggleUserDropdown = () => {
    this.setState({userDropdownOpen:!this.state.userDropdownOpen})

  }
  render(){
    return (
      <Dropdown isOpen={this.state.userDropdownOpen} toggle={this.toggleUserDropdown}>
        <DropdownToggle caret>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Resend Mail</DropdownItem>
          <DropdownItem>Review Quiz</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

}

class CourseForm extends Component {
  render(){
    if(this.props.course === undefined){
      return (<div>Course not loaded yet ... </div>)
    }

    return (<div>
      <FormGroup>
        <Label>Name</Label>
        <InputGroup>
          <Input type="text" placeholder="Course Name. Should be less than 140 characters"
            maxLength="140" id="name" value={this.props.course.name} onChange={this.props.handleChange} />
          <InputGroupAddon className="text-muted">{ 140 - this.props.course.name.length}</InputGroupAddon>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label>Tagline</Label>
        <InputGroup>
          <Input type="text" placeholder="Tag Line. Should be less than 140 characters" id="tagline"
            maxLength="140" value={this.props.course.tagline} onChange={this.props.handleChange} />
          <InputGroupAddon className="text-muted">{ 140 - this.props.course.tagline.length }</InputGroupAddon>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label>Description</Label>
        <Input type="textarea" rows="20" id="description" value={this.props.course.description} onChange={this.props.handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Price</Label>
        <InputGroup>
          <InputGroupAddon>RM</InputGroupAddon>
          <Input type="number" id="price" onChange={this.props.handleChange} value={this.props.course.price} />
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label>Key Points</Label>
        <Card>
          <CardBody>
            {
              (this.props.course.key_points === undefined || this.props.course.key_points.length === 0) ?
              (<p>No key points configured.</p>) :
              this.props.course.key_points.map( (e,i) => {
                return (<FormGroup key={i}>
                  <InputGroup className="mb-2">
                    <Input type="text" placeholder={`Title for Point ${i+1}. Should be less than 70 characters`}
                      maxLength="70" id={`key_points`} data-position={i} data-key="title"
                      value={e.title} onChange={this.props.handleChange}
                    />
                    <InputGroupAddon className="text-muted">{ 70 - e.title.length }</InputGroupAddon>
                  </InputGroup>
                  <InputGroup className="mb-2">
                    <Input type="text" placeholder={`Subtext for Point ${i+1}. Should be less than 140 characters`}
                      maxLength="140" id={`key_points`} data-position={i} data-key="subtext"
                      value={e.subtext} onChange={this.props.handleChange}
                    />
                    <InputGroupAddon className="text-muted">{ 140 - e.subtext.length }</InputGroupAddon>
                  </InputGroup>
                  <Button type="button" color="danger" data-position={i} onClick={this.deleteKeyPoint}><FontAwesome name="minus" /></Button>
                </FormGroup>)
              })
            }
            <Button type="button" color="primary" onClick={this.props.newKeyPoint} disabled={!this.props.enableAddKeyPoint()}>New Key Points</Button>
          </CardBody>
        </Card>
      </FormGroup>
      <Button color="primary" onClick={this.props.handleUpdateCourse} disabled={!this.props.validateGeneralForm()}>Update Course Setting</Button>
    </div>);

  }
}

class CourseModules extends Component {
  constructor(props){
    super(props)
    this.state = { modules:[]}
  }
  componentDidMount = async () => {
    try {
      var results = await this.getModules();
      this.setState({modules:results});

    } catch(e){
      console.log('error getting modules');
      console.log(e);
    }

  }
  handleCreateModule = async (e) => {
    //creat the module based on type then go to the appropite module builder
    var handle = this;
    var moduleType = e.target.dataset.type;
    var courseId = this.props.course.courseId;
    console.log(`create new ${moduleType} for course ${courseId}`);
    try {
      var result = await this.createModule(moduleType, courseId);
      console.log('create result', result);
      handle.props.history.push(`/user/${moduleType}_builder/${result.courseId}/${result.moduleId}`);
    } catch(e){
      console.log('error creating a new module');
      console.log(e);
    }
  }
  createModule = (type, courseId) => {
    //api call to generate article / quiz
    return invokeApig({
      endpoint:config.apiGateway.MODULE_URL,
      path:'/modules',
      method:'POST',
      body: {courseId:courseId, title:`New ${type}`, description:`Content for new ${type}`,
        moduleType:type, order:this.state.modules.length+1}
    });
  }
  handleDeleteModule = async (e) => {
    if(!window.confirm('Really delete?')){
      return;
    }

    var handle = this;
    var moduleIndex = e.target.dataset.index;
    var module = this.state.modules[moduleIndex]
    try {
      /* if the module is a file, also delete the file */
      if(module.moduleType === 'doc'){
        var result = await this.getModuleDetail(module.courseId, module.moduleId);
        console.log(`attempt to delete ${result.body.key}`)
        await s3Delete(result.body.key);
      }
      await this.deleteModule(module.courseId,module.moduleId);
      var newModules = this.state.modules;
      newModules.splice(moduleIndex, 1);
      handle.setState({modules:newModules});
    } catch(e){
      console.log('error in deleting module');
      console.log(e);
    };
  }
  deleteModule = (courseId, moduleId) => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      method: 'DELETE',
      path:`/modules/${moduleId}`,
      queryParams: {courseId:courseId}
    });
  }
  getModules = () => {
    return invokeApig({
      endpoint:config.apiGateway.MODULE_URL,
      path:'/modules',
      queryParams: {courseId:this.props.course.courseId}
    })

  }
  getModuleDetail = (courseId, moduleId) => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path: `/modules/${moduleId}`,
      queryParams: {courseId:courseId}
    })
  }
  render(){
    return (
      <Row className="mt-3">
        <div className="col-12">
          <h3>Module Manager</h3>
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
            </Nav>
          </Navbar>
          <hr/>
        </div>
        <div className="col-12 col-md-8">
          {
            this.state.modules.length === 0 ? (
              <div>No modules.</div>

            ) : (
              this.state.modules.sort( (a,b) => parseInt(a.order,10) > parseInt(b.order,10) ).map( (e,i) => {
                var titleCaseType = toTitleCase(e.moduleType);
                return (
                  <Card key={i} className="mb-2">
                    <CardBody>
                      <CardTitle>Module {i+1}: {e.title}</CardTitle>
                      <CardText>{e.description}</CardText>
                      <CardText>Order: {e.order}</CardText>
                      <Button className="mr-2" color="primary" tag={Link} to={`/courses/${e.moduleType}/${e.courseId}/${e.moduleId}`}>View {titleCaseType}</Button>
                      <Button className="mr-2" color="info" tag={Link} to={`/user/${e.moduleType}_builder/${e.courseId}/${e.moduleId}`}>Edit {titleCaseType}</Button>
                      <Button type="button" color="danger" data-index={i} onClick={this.handleDeleteModule}>Delete {titleCaseType}</Button>
                    </CardBody>
                  </Card>
                );
              })
            )
          }
        </div>
      </Row>
    )
  }

}

export default class CourseBuilder extends Component {
  constructor(props){
    super(props);
    this.state = {settingActiveTab:'general', userDropdownOpen:false, course:null };
  }
  toggle = (tab) => {
    if(this.state.settingActiveTab !== tab){
      this.setState({settingActiveTab:tab});
    }
  }
  componentDidMount = async() => {
    //load the course
    var handle = this;
    try {
      var result = await this.getCourse();
      result.tagline = result.tagline === undefined ? '' : result.tagline;
      if(result != null){
        handle.setState({course:result});
      }
    } catch(e){
      console.log(e);
    };
  }
  getCourse = () => {
    return invokeApig({path:`/courses/${this.props.match.params.id}`})
  }
  handleUpdateCourse = async (e) => {
    e.preventDefault();
    console.log('should send updates on new course settings');
    try{
      await this.updateCourse();
      this.props.history.push(`/courses/promo/${this.state.course.courseId}`);
      this.props.addNotification('Course updated ...');
    }catch(e){
      console.log(e);
    }

  }
  updateCourse = () => {
    return invokeApig({
      path:`/courses/${this.props.match.params.id}`,
      method:'PUT',
      body:this.state.course
    })
  }
  handleNewModule = async (e) => {
    //generate new module based on inputs
  }
  newModule = () => {
  }
  handleChange = event => {
    var newCourse = this.state.course;
    event.target.id === "key_points" ? (
      newCourse[event.target.id][parseInt(event.target.dataset.position, 10)][event.target.dataset.key] =
        event.target.dataset.key === "title" ? toTitleCase(event.target.value) :
        event.target.value
    ) : (
      newCourse[event.target.id] =
        event.target.id === "name" ? toTitleCase(event.target.value) :
        event.target.value
    );
    this.setState({ course:newCourse});
  }
  validateGeneralForm = () => {
    //validate the general form
    var titleNotEmpty = this.state.course.name.length > 0;
    var descriptionNotEmpty = this.state.course.description.length > 0;
    var priceNotEmpty = this.state.course.price !== "";
    var keyPointsNotEmpty = (this.state.course.key_points === undefined || this.state.course.key_points === null ) ? true : (
      this.state.course.key_points.reduce( (v,e) => {
        return v && (e.title.length > 0 && e.subtext.length > 0)
      }, true)
    )

    return titleNotEmpty && descriptionNotEmpty && priceNotEmpty && keyPointsNotEmpty;
  }
  newKeyPoint = (e) => {
    var newCourse = this.state.course;
    var keyPoint = {title:'', subtext:''};
    newCourse.key_points === undefined ?
      newCourse.key_points = [keyPoint] :
      newCourse.key_points.push(keyPoint);
    this.setState({course:newCourse});
  }
  deleteKeyPoint = (e) => {
    var newCourse = this.state.course;
    newCourse.key_points.splice(parseInt(e.target.dataset.position, 10),1);
    this.setState(newCourse);
  }
  enableAddKeyPoint = () => {
    if(this.state.course.key_points === undefined){
      return true;
    }
    return this.state.course.key_points.length < 3;
  }
  render(){
    //user is authenticated
    if(!this.props.isAuthenticated){
      return (<Notice content='User is not authenticated.' />);
    };

    //course has been loaded
    if(this.state.course === null){
      //return note('Course is note loaded yet ...')
      return (<Notice content='Course is not loaded yet ...' />);
    }

    /*
      userId in dynamoDb is identity pool id *which links to user pool id*, but
      what we only got is user pool id
    console.log("currentUser", this.props.currentUser);
    console.log("course.userId", this.state.course.userId);
    console.log("cognito:username", this.props.currentUser["cognito:username"]);
    if(this.state.course.userId !== this.props.currentUser["cognito:username"]){
      return (<Notice title="Unauthorized" content="You can't access this resource" />);
    }
    */

    return (
      <Container className="mt-2 text-left">
        <Helmet>
          <title>Course Builder for {this.state.course.name} - AutoTrainer</title>
        </Helmet>
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/user/landing">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Course Builder: {this.state.course.name}</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Row>
        <Row>
          <div className="col-12">
            <h3>Settings</h3>
            <hr/>
          </div>
          <div className="col-12 col-md-8">
            <Nav tabs>
              <NavItem>
                <NavLink className={ classnames({active:this.state.settingActiveTab==='general'})} onClick={() => {this.toggle('general');}}>General</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={ classnames({active:this.state.settingActiveTab==='stats'})} onClick={() => {this.toggle('stats');}}>Stats</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={ classnames({active:this.state.settingActiveTab==='users'})} onClick={() => {this.toggle('users');}}>Users</NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.settingActiveTab}>
              <TabPane tabId='general'>
                <CourseForm {...this.state}
                  handleChange={this.handleChange} enableAddKeyPoint={this.enableAddKeyPoint} newKeyPoint={this.newKeyPoint}
                  handleUpdateCourse={this.handleUpdateCourse} deleteKeyPoint={this.deleteKeyPoint} validateGeneralForm={this.validateGeneralForm}
                />
              </TabPane>
              <TabPane tabId='stats' className="mb-2">
                <p>Warning: Not yet configured</p>
                <ul>
                  <li>Distributed: {randomInt(40,540)} users </li>
                  <li>Started: {randomInt(40,540)} users </li>
                  <li>Finished: {randomInt(40,540)} users </li>
                </ul>
                {
                  /*
                    To configure banner background picture
                    <FormGroup>
                      <Label>Banner Picture</Label>
                      <p>upload banner picture here ...</p>
                    </FormGroup>
                  */
                }
              </TabPane>
              <TabPane tabId='users'>
                <p>Warning: Not yet configured</p>
                <Table className="mt-2">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>User</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{ Array.from( Array( randomInt(5,25)).keys() ).map( (e,i) => {
                    return (<tr key={i}>
                        <td>{i+1}</td>
                        <td>Some User</td>
                        <td>{['Distributed', 'Signed Up', 'Started', 'Finished & Certified'][randomInt(3)]}</td>
                        <td><CourseUser /></td>
                      </tr>)

                  })}</tbody>
                </Table>
                <p><Button color="primary">Send Invites</Button></p>
              </TabPane>
            </TabContent>
          </div>
        </Row>
        <CourseModules {...this.state} {...this.props}/>
      </Container>
    )
  }
}
