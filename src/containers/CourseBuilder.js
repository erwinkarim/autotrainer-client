import React, { Component } from "react";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import { Navbar, Jumbotron } from 'reactstrap';
import { FormGroup, Label,InputGroup, Input, InputGroupAddon, InputGroupText, Button, FormText}from 'reactstrap';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { Alert, CardColumns, CardDeck, Card, CardBody, CardTitle, CardText, Collapse} from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import toTitleCase from 'titlecase';
import FontAwesome from 'react-fontawesome';
import { invokeApig, s3Upload, s3Delete } from "../libs/awsLibs";
import Notice from '../components/Notice';
import Helmet from 'react-helmet';
import './CourseBuilder.css';
import config from '../config.js'
import EmailValidator from 'email-validator';

/*
  sets the compan(ies) that attend this course. upto 6 will be displayed
  all logos are in /public/logo directory
  TODO: move logo's directory to S3 (technically it is)
*/
class ClientTestimonials extends Component {
  constructor(props){
    super(props);
    this.state = {
      coList:[]
    };
  }
  render(){
    return (
      <div>
        <Row>
          { this.props.clientList.map( (c,i) => {
            return (
              <Col xs="6" md="2" key={i}>
                <img className="img-fluid img-grayscale" alt={c} src={`/logos/${c}`} />
              </Col>
            );
          })}
        </Row>
        <FormGroup check className="row p-2">
          { this.props.companyList.sort( (ca,cb) => { return ca.name > cb.name; }).map( (c,i) => {
            return (
              <Label key={i} check className="col-6 col-md-3">
                <Input type="checkbox" name="companies[]" value={c.logo}
                  onChange={this.props.toggleCompany}
                  checked={this.props.clientList.includes(c.logo)}/>
                {` ${c.name}`}
              </Label>
            )
          })}
        </FormGroup>
      </div>
    )
  }
}

ClientTestimonials.defaultProps = {
  companyList:[
    { logo:"256x256 BKR-rd.png" , name:'Bank Rakyat'},
    { logo:"256x256 IIT-rd.png" , name:'Insurance Islam TAIB'},
    { logo:"256x256 KN-rd.png" , name:'Khazanah Nasional'},
    { logo:"256x256 TI-rd.png" , name:'Thanachart Insurance'},
    { logo:"256x256 TMIG-rd.png" , name:'Tokyo Marine Insurance Group'},
    { logo:"256x256 WBG-rd.png" , name:'World Bank Group'},
    { logo:"hsbc_amanah.gif" , name:'HSBC Amanah Takaful'},
    { logo:"256x80 BankIslam.png" , name:'Bank Islam'},
    { logo:"256 HLA.png" , name:'Hong Leong Assurance'},
    { logo:"256x512 Etiqa.png" , name:'Etiqa Insurance'},
    { logo:"256x256 TuneIns.png" , name:'Tune Insurance'}
  ]
}
/*
  describe the course user, it's progress
*/
class CourseUser extends Component {
  constructor(props){
    super(props);
    this.state = {collapse:false};
  }
  toggleMenu = (e) => {
    this.setState({collapse: !this.state.collapse});
  }
  handleResendInvite = async (e) => {
    console.log('should handle resent invite');

    // at this point, userMeta does not exists yet, so userId should hold the
    // email address
    try{
      console.log('attempt to resend invite');
      await this.resendInvite();
      this.props.addNotification(`Resend invite to ${this.props.student.userId}`);
    } catch(e){
      console.log('error in resending invite');
      console.log(e);
    };

  }
  resendInvite = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      method: 'POST',
      path: `/enrolment/${this.props.course.courseId}/invite`,
      body: {
        inviteList: [ { email:this.props.student.userId, name: this.props.student.userId }],
        meta: { course_owner: this.props.currentUser.name }
      }
    })

  }
  render(){
    var modulesAttended = this.props.student.progress === undefined ? 0 :
      this.props.student.progress.length;

    var studentName = this.props.student.userMeta ?
      this.props.student.userMeta.UserAttributes.find( e => e.Name === 'name').Value :
      this.props.student.userId;

    var currentStatus = this.props.student.status ?
      toTitleCase(this.props.student.status) : 'Enrolled';

    return (
      <Row>
        <Col xs="12" md="1">{this.props.index+1}</Col>
        <Col xs="12" md="5">
          <Button className="p-0" color="link" onClick={this.toggleMenu}>{studentName}</Button>
        </Col>
        <Col xs="12" md="3">{modulesAttended} modules</Col>
        <Col xs="12" md="3">{currentStatus}</Col>
        <Collapse isOpen={this.state.collapse} className="col-12 mt-2">
          <CardColumns>
            <Card body>
              <CardTitle>Progress</CardTitle>
              <CardText>{modulesAttended} modules completed</CardText>
            </Card>
            <Card body>
              <CardTitle>Status</CardTitle>
              <CardText>{currentStatus}</CardText>
              { currentStatus === 'Invited' ? <Button size="sm" onClick={this.handleResendInvite}>Resend Invite</Button> : null }
            </Card>
          </CardColumns>
        </Collapse>
        <Col xs="12"><hr /></Col>
      </Row>
    );
  }
}

/*
  manage the students, handle send invites and see their progress through then
  course
*/
class CourseUsers extends Component {
  constructor(props){
    super(props);
    this.state = {
      students:[]
    }
  }
  componentDidMount = () => {
    this.handleLoadStudents();
  }
  handleLoadStudents = async () => {
    //load enrolled users
    try{
      var results = await this.loadStudents()
      this.setState({students:results});
    } catch(e){
      console.log('error getting students');
      console.log(e);
    }

  }
  loadStudents = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path: `/enrolment/${this.props.course.courseId}/students`
    });
  }
  handleRefreshStudents = async () => {
    this.setState({students:[]});
    try {
      var result = await this.loadStudents();
      this.setState({students:result});
    } catch(e){
      console.log('error refreshing student list');
      console.log(e);
    }
  }
  render(){
    /*
    if(this.state.students.length === 0){
      return <div>Nobody is enrolled in the course</div>
    };
    */

    return (
      <Container className="mt-2">
        <Row>
          <Col xs="12" md="1"><strong>No</strong></Col>
          <Col xs="12" md="5"><strong>Name</strong></Col>
          <Col xs="12" md="3"><strong>Progress</strong></Col>
          <Col xs="12" md="3"><strong>Status</strong></Col>
          <Col xs="12"><hr /></Col>
        </Row>
        <Row>
          <Col xs="12" className="text-right">
            <Button color="secondary" onClick={this.handleRefreshStudents}>
              <FontAwesome name="redo" />
            </Button>
          </Col>
        </Row>
        {
          this.state.students.length === 0 ? (
            <Row>
              <Col>Nobody is enrolled in this course yet</Col>
            </Row>
          ) : this.state.students.map( (student,i) => {
            return <CourseUser key={i} index={i} student={student} {...this.props } />
          })
        }
        <InviteBox {...this.props} students={this.state.students }
          handleLoadStudents={this.handleLoadStudents}
        />
      </Container>
    );
  }
}

/*
  handle send invitation to potential students, also check if students exists or not
*/
class InviteBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      showInviteForm:false,
      inviteList:[]
    }
  }
  componentDidMount = () => {
    this.addInvite();
  }
  handleChange = (e) => {
    if(e.target.id === "inviteMessage"){
      this.setState({inviteMessage:e.target.value});
      return;
    }

    var newInviteList = this.state.inviteList;
    newInviteList[e.target.dataset.index][e.target.dataset.attr] = e.target.value;
    this.setState({inviteList:newInviteList});

  }
  toggleMenu = (e) => {
    this.setState({showInviteForm: !this.state.showInviteForm});
  }
  handleSendInvite = async (e) => {
    console.log('process the email list and send invites ...')
    this.setState({showInviteForm:false});

    //pre-flight checks
    // drop users that already has been invited
    this.props.students.forEach( e => {
      //TODO: need to handle cases where user attributes doesn't exists
      var dropIndex = this.state.inviteList.findIndex( elm => {
        //check if the user id is an email
        if(elm.email === e.userId){
          return true;
        };

        //check for  userMeta info
        if(!e.userMeta){
          return false;
        }

        if(!e.userMeta.UserAttributes){
          return false;
        }

        return elm.email === e.userMeta.UserAttributes.find(
          urAtr => { return urAtr.Name === 'email'}).Value; }
        )

      if(dropIndex !== -1){
        console.log(`dropping ${ this.state.inviteList[dropIndex].email} ...`)
        this.props.addNotification(`${ this.state.inviteList[dropIndex].email } dropped from invite list ...`, 'danger')
        this.state.inviteList.splice(dropIndex, 1);
      };
    });

    //if the invite list is empty, drop the invite request
    if(this.state.inviteList.length === 0){
      this.props.addNotification('Invite list is empty. Aborting invite request', 'danger');
      return;
    };

    //api call to send invite
    try{
      console.log(Date.now()/1000, 'sending invite');
      await this.sendInvite();
    } catch(e){
      console.log('error in sending invite');
      console.log(e);
      return;
    }

    //notification on invite sent
    this.props.addNotification('Invitation sent');

    //reset the invite list and reload the course
    this.setState({inviteList:[]});

    //wait for a while
    //setTimeout( () => {}, 2000);

    //actually need to invoke the parents to reload the student list
    // TODO: just try to add the new invites in the student list instead of making an API call
    console.log(Date.now()/1000, 'refreshing student list');
    this.props.handleLoadStudents();
  }
  sendInvite = () => {
    invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      method: 'POST',
      path: `/enrolment/${ this.props.course.courseId}/invite`,
      body: {
        inviteList: this.state.inviteList,
        meta: { course_owner:this.props.currentUser.name}
      }

    })
  }
  addInvite = (e) => {
    const defaultInvite = {
      email:'', name:''
    };
    var newInviteList = this.state.inviteList;
    newInviteList.push(defaultInvite);
    this.setState({inviteList:newInviteList});
  }
  removeInvite = (e) => {
    var newInviteList = this.state.inviteList;
    newInviteList.splice(e.target.dataset.index, 1);
    this.setState({inviteList:newInviteList});
  }
  validateForm = () => {
    var validateListLength = this.state.inviteList.length > 0;
    var validateList = this.state.inviteList.reduce( (a,v) => {
      return a && v.email.length > 0 && v.name.length > 0;
    }, true);
    var validateEmail = this.state.inviteList.reduce( (a,v) => {
      return a && EmailValidator.validate(v.email)
    }, true);

    return validateListLength && validateList && validateEmail;
  }
  enableInviteButton = () => {
    return this.props.course.status === 'published';
  }
  render(){
    return (
      <Row>
        <Collapse isOpen={!this.state.showInviteForm}>
          <Col>
            <Button onClick={this.toggleMenu} disabled={ !this.enableInviteButton()}>Invite Participants</Button>
            { this.props.course.status === 'unpublished' ? <small className="text-muted ml-2">You can only invite people when the course is published</small> : null}
          </Col>
        </Collapse>
        <Collapse isOpen={this.state.showInviteForm} className="w-100">
          { this.state.inviteList.map( (invitee, i) => {
            return (
              <FormGroup className="row" key={i}>
                <Col xs="12" md="5" className="mb-2">
                  <Input type="email" placeholder="email" onChange={this.handleChange}
                    valid={EmailValidator.validate(invitee.email)}
                    data-index={i} data-attr="email" id="invite" value={invitee.email} />
                </Col>
                <Col xs="12" md="5" className="mb-2">
                  <Input type="text" placeholder="name" onChange={this.handleChange}
                    data-index={i} data-attr="name" id="invite" value={invitee.name} />
                </Col>
                <Col xs="12" md="2" className="mb-2">
                  <Button color="danger" onClick={this.removeInvite} data-index={i}
                    disabled={this.state.inviteList.length <= 1} >
                    <FontAwesome name="minus" />
                  </Button>
                </Col>
              </FormGroup>
            )
          })}
          <Col xs="12" className="px-0 mb-2"><Button color="primary" onClick={this.addInvite}><FontAwesome name="plus" /></Button></Col>
          <Col xs="12" className="px-0">
            <Button className="mb-2 mr-2" color="primary" onClick={this.handleSendInvite} disabled={!this.validateForm()}>Send Invite</Button>
            <Button className="mb-2 mr-2" color="danger" onClick={this.toggleMenu}>Cancel</Button>
          </Col>
        </Collapse>
      </Row>
    );
  }
}

class CourseForm extends Component {
  render(){
    if(this.props.course === undefined){
      return (<div>Course not loaded yet ... </div>)
    }

    var bg_styling = this.props.bg_pic_data ?
      {backgroundImage:`url(${this.props.bg_pic_data})`, backgroundRepeat:'no-repeat', backgroundSize:'cover'} :
      {};
    var title_font_styling = this.props.course.title_font_color ?
      { color:this.props.course.title_font_color} : {color:'black'};
    var styling = Object.assign({}, bg_styling);
    styling = Object.assign(styling, title_font_styling );

    var bg_file_name = this.props.bg_handle ?
      (this.props.bg_handle instanceof Object ? this.props.bg_handle.name : this.props.bg_handle) :
      '' ;

    return (<div>
      <FormGroup>
        <Label>Name</Label>
        <h1 className="text-center">
          <InputGroup>
            <Input type="text" placeholder="Course Name. Should be less than 140 characters"
              className="display-3 text-center" style={ {fontSize:'inherit'}}
              maxLength="140" id="name" value={this.props.course.name} onChange={this.props.handleChange} />
            <InputGroupAddon addonType="append" className="text-muted"><InputGroupText>{ 140 - this.props.course.name.length}</InputGroupText></InputGroupAddon>
          </InputGroup>
        </h1>
      </FormGroup>
      <FormGroup>
        <Label>Font Color</Label>
        <Input type="select"
          id="title_font_color" value={this.props.course.title_font_color} onChange={this.props.handleChange}>
          <option value="black">Black</option>
          <option value="darkslategray">Dark Slate Gray</option>
          <option value="gray">Gray</option>
          <option value="gainsboro">Gainsboro</option>
          <option value="ghostwhite">Ghost White</option>
          <option value="white">White</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label>Background Picture</Label>
        <Input type="file" placeholder="Background picture" id="bg_pic" onChange={this.props.handleChange} />
        <FormText color="muted">JPEG only images. Should fit in 1600x900 pixels and under 2 MB in size.</FormText>
        {
          this.props.course.bg_pic ? <Input disabled={true} value={bg_file_name} /> : null
        }
      </FormGroup>
      <p>Preview</p>
      <Jumbotron fluid style={styling} className="text-center">
        <Container>
          <h1 className="display-3 text-center">{this.props.course.name}</h1>
          { this.props.course.tagline !== undefined ? (<p className="lead">{this.props.course.tagline}</p>) : null}
          <p><Button outline color="primary">Enrol for RM{this.props.course.price}</Button></p>
        </Container>
      </Jumbotron>
      <FormGroup>
        <Label>Tagline</Label>
          <InputGroup>
            <Input type="text" placeholder="Tag Line. Should be less than 140 characters" id="tagline"
              className="lead text-center"
              maxLength="140" value={this.props.course.tagline} onChange={this.props.handleChange} />
            <InputGroupAddon addonType="append" className="text-muted">
              <InputGroupText>{ 140 - this.props.course.tagline.length }</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label>Description / Final Thoughts</Label>
        <Input className="lead" type="textarea" rows="20" id="description" value={this.props.course.description} onChange={this.props.handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Pricing</Label>
        <InputGroup>
          <InputGroupAddon addonType="prepend">RM</InputGroupAddon>
          <Input type="number" id="price" onChange={this.props.handleChange} value={this.props.course.price} />
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label>Key Points</Label>
        <CardDeck>
          {
            (this.props.course.key_points === undefined || this.props.course.key_points.length === 0) ?
            (<p>No key points configured.</p>) :
            this.props.course.key_points.map( (e,i) => {
              return (
                <Card key={i}>
                  <CardBody>
                    <FormGroup>
                      <h4>
                        <InputGroup className="mb-2">
                          <Input type="text" placeholder={`Title for Point ${i+1}. Should be less than 70 characters`}
                            style={ {fontSize:'inherit'}} className="card-title text-center"
                            maxLength="70" id={`key_points`} data-position={i} data-key="title"
                            value={e.title} onChange={this.props.handleChange}
                          />
                          <InputGroupAddon addonType="append" className="text-muted">
                            <InputGroupText>{ 70 - e.title.length }</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </h4>
                      <InputGroup className="mb-2">
                        <Input type="textarea" placeholder={`Subtext for Point ${i+1}. Should be less than 140 characters`}
                          rows="4"
                          maxLength="140" id={`key_points`} data-position={i} data-key="subtext"
                          value={e.subtext} onChange={this.props.handleChange}
                        />
                        <InputGroupAddon addonType="append" className="text-muted">
                          <InputGroupText>{ 140 - e.subtext.length }</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <Button type="button" color="danger" data-position={i} onClick={this.props.deleteKeyPoint}><FontAwesome name="minus" /></Button>
                    </FormGroup>
                  </CardBody>
                </Card>
              )
            })
          }
          {
            this.props.enableAddKeyPoint() ?
              <Button type="button" color="primary" onClick={this.props.newKeyPoint} disabled={!this.props.enableAddKeyPoint()}>New Key Points</Button> :
              null
          }
        </CardDeck>
      </FormGroup>
      <div>
        <Label>Client attendees</Label>
        <FormText>Select upto 6 companies that have attended this course. WARNING: We are not liable if you give out false information</FormText>
        <ClientTestimonials toggleCompany={this.props.toggleCompany} clientList={this.props.course.clientList}/>
      </div>
      <Button color="primary" onClick={this.props.handleUpdateCourse} disabled={!this.props.validateGeneralForm()}>Update Course Setting</Button>
    </div>);

  }
}

class CourseModules extends Component {
  constructor(props){
    super(props)
    this.state = { modules:[], publish_status:'all',
      showOrderChangedBanner:false, orig_modules:null, updating_order: false
    }
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
      /*
        if the module is a file, also delete the file
        issues if the old version is not there. like, there's no key
      */
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
  handleOrderUpdate = (e) => {
    //console.log('should re-arrange the modules');

    /*
      plan,
      1. find out which module order the update and get the current ordering
      2. splice and put the currently selected module in the array
      3. update the ordering at state level
      4. put up a banner showing order has change and needs confirmation to update it
    */
    if(!this.state.orig_modules){
      this.setState({orig_modules: JSON.parse( JSON.stringify( this.state.modules ))});
    };

    var newModuleOrder = this.state.modules.sort( (a,b) => a.order > b.order );
    var moduleIndex = newModuleOrder.findIndex( (elm) => elm.moduleId === e.target.dataset.moduleId );
    var newModuleIndex = newModuleOrder.findIndex( (elm) => elm.moduleId > e.target.value);
    var moduleInfo = newModuleOrder.splice(moduleIndex,1);
    newModuleOrder.splice(newModuleIndex,0, moduleInfo[0]);
    newModuleOrder.forEach( (e,i) => { e.order = i+1; });

    this.setState({modules:newModuleOrder, showOrderChangedBanner:true});

  }
  confirmOrderUpdate = async (e) => {
    this.setState({updating_order:true});
    /*
      get each of the module the moduleId and new ordering info
      invoke API to get the new order
      reload the modules
    */
    try {
      var result = await this.orderUpdate()
      this.setState({modules:result, orig_modules:null , showOrderChangedBanner: false, updating_order: false});
      this.props.addNotification('Modules re-ordered', 'success');
    } catch (e){
      console.log('error updating module orders');
      console.log(e);
    }
  }
  orderUpdate = () => {
    return invokeApig({
      method: 'POST',
      path: `/courses/${this.props.course.courseId}/reorder_modules`,
      body: {
        new_order: this.state.modules.map( (e,i) => { return {moduleId:e.moduleId, order:e.order}; } )
      }
    });
  }
  handleRevertModuleOrder = (e) => {
    //console.log('should revert to original');
    this.setState( {
      modules: JSON.parse( JSON.stringify( this.state.orig_modules )),
      orig_modules: null,
      showOrderChangedBanner: false
    });
  }
  getModules = () => {
    return invokeApig({
      endpoint:config.apiGateway.MODULE_URL,
      path:'/modules',
      queryParams: {courseId:this.props.course.courseId, publish_status:this.state.publish_status}
    })
  }
  togglePublishStatus = async (event) => {
    var newPublishStatus = this.state.publish_status;
    newPublishStatus = newPublishStatus === 'all' ? 'published' : 'all';

    try {
      await this.setState({publish_status:newPublishStatus});
      var newModules = await this.getModules();
      this.setState({modules:newModules});
    } catch(e){
      console.log('error refreshing modules')
      console.error(e);
    }

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
              <UncontrolledDropdown>
                <DropdownToggle caret nav>Filter</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={this.togglePublishStatus}><FontAwesome name={ this.state.publish_status === 'all' ? 'square' : 'check-square'}/> Published Only</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Navbar>
          <hr/>
        </div>
        {
          /* showing confirmation dialog when order changed */
          this.state.showOrderChangedBanner ? (
            <div className="col-12">
              <Alert color="info">Order has been change. Confirm update?
                <Button outline color="primary" className="mx-2" onClick={this.confirmOrderUpdate} disabled={this.state.updating_order}>Yes</Button>
                <Button outline color="danger" onClick={this.handleRevertModuleOrder} disabled={this.state.updating_order}>No</Button>
              </Alert>
            </div>
          ) : null
        }
        { /* <div className="col-12 col-md-8"> */}
        <CardColumns>
          {
            this.state.modules.length === 0 ? (
              <Col><Row><p>No Modules</p></Row></Col>
            ) : (
              this.state.modules.sort( (a,b) => parseInt(a.order,10) > parseInt(b.order,10) ).map( (e,i) => {
                var titleCaseType = toTitleCase(e.moduleType);
                return (
                  <Card key={i} className="mb-2">
                    <CardBody>
                      <CardTitle>Module {i+1}: {e.title}</CardTitle>
                      <CardText>{e.description}</CardText>
                      <CardText>Order:
                        <Input type="select" value={e.order} onChange={this.handleOrderUpdate} data-module-id={e.moduleId}>
                          { this.state.modules.map( (module, module_index) => {
                            return <option key={module_index} value={module.order} >{module.order}</option>;
                          })}
                        </Input>
                      </CardText>
                      <CardText>Publish status: {e.publish_status}</CardText>
                      <Button className="mr-2 mb-2" color="primary" tag={Link} to={`/courses/${e.moduleType}/${e.courseId}/${e.moduleId}`}>View {titleCaseType}</Button>
                      <Button className="mr-2 mb-2" color="info" tag={Link} to={`/user/${e.moduleType}_builder/${e.courseId}/${e.moduleId}`}>Edit {titleCaseType}</Button>
                      <Button className="mr-2 mb-2" type="button" color="danger" data-index={i} onClick={this.handleDeleteModule}>Delete {titleCaseType}</Button>
                    </CardBody>
                  </Card>
                );
              })
            )
          }
        </CardColumns>
      </Row>
    )
  }

}

export default class CourseBuilder extends Component {
  constructor(props){
    super(props);
    this.state = {settingActiveTab:'general',
      userDropdownOpen:false,
      course:null, loading:true,
      bg_handle:null , bg_pic_data:null
    };
  }
  toggle = (tab) => {
    if(this.state.settingActiveTab !== tab){
      this.setState({settingActiveTab:tab});
    }
  }
  toggleCompany = (e) => {
    //update company list
    if(e.target.value !== undefined){
      //add if not there, delete if it's there
      var newCourse = this.state.course;
      var newCoList = newCourse.clientList;
      newCoList.includes( e.target.value) ?
        newCoList.splice( newCoList.findIndex( (elm) => { return elm === e.target.value}),1) :
        newCoList.push(e.target.value);

      //if more than 8, slice the first element
      if(newCoList.length > 6){
        newCoList.splice(0,1);
      };

      newCourse.clientList = newCoList;
      this.setState({course:newCourse});
    }
  }
  componentDidMount = async() => {
    //load the course
    var handle = this;
    try {
      var result = await this.getCourse();
      result.tagline = result.tagline === undefined || result.tagline === null ? '' : result.tagline;
      result.key_points = result.key_points === undefined || result.key_points === null ? [] : result.key_points;
      result.bg_pic = result.bg_pic === undefined || result.bg_pic === null ? '' : result.bg_pic;
      result.bg_key = result.bg_key === undefined || result.bg_key === null ? '' : result.bg_key;
      result.clientList = result.clientList === undefined || result.clientList === null ? [] : result.clientList;

      if(result != null){
        handle.setState({course:result, loading:false});
      }

      //setup the picture preview
      if(this.state.course.bg_pic !== null && this.state.course.bg_pic !== ''){
        //course.bg_pic should be a string
        this.setState({bg_handle: this.state.course.bg_pic});
        this.updatePicture(this.state.course.bg_pic);
      };

    } catch(e){
      console.log(e);
    };

  }
  getCourse = () => {
    return invokeApig({path:`/courses/${this.props.match.params.id}`})
  }
  handleUpdateCourse = async (e) => {
    e.preventDefault();
    var handle = this;

    //upload new file
    if(handle.state.bg_handle instanceof Object){
      //delete old one, upload new one

      var oldKey = null;

      if(handle.state.course.bg_pic !== null){
        oldKey = handle.state.course.bg_key;
      }

      //upload new file
      try{
        var newFile = await s3Upload(handle.state.bg_handle);
        handle.state.course.bg_pic = newFile.Location;
        handle.state.course.bg_key = newFile.key;
        if(oldKey){
          //delete old file if applicable
          await s3Delete(oldKey);
        };
        handle.setState({bg_handle: newFile.Location});
      } catch(e){
        console.log('error uploading new file');
        console.error(e);
        return;
      }

    }

    console.log('should send updates on new course settings');
    try{
      await this.updateCourse();
      // so annoying when doing multple updates ...
      //this.props.history.push(`/courses/promo/${this.state.course.courseId}`);
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
    var handle = this;
    event.target.id === "key_points" ? (
      newCourse[event.target.id][parseInt(event.target.dataset.position, 10)][event.target.dataset.key] =
        event.target.dataset.key === "title" ? toTitleCase(event.target.value) :
        event.target.value
    ) : (
      newCourse[event.target.id] =
        event.target.id === "name" ? toTitleCase(event.target.value) :
        event.target.value
    );

    //additional checks if the target id is bg_pic
    //load as datastream
    if(event.target.id === 'bg_pic'){
      //do nothing if files are undefined
      if(event.target.files[0] === undefined || event.target.files[0] === null){
        return;
      }

      if(event.target.files[0].size > 1024*1024*2){
        console.log('file too big');
        this.props.addNotification('File size too big', 'danger');
        return;
      };

      if(event.target.files[0].type !== 'image/jpeg'){
        console.log('must be image file');
        this.props.addNotification('File is not an image', 'danger');
        return;

      };

      //handle the file
      handle.setState({bg_handle:event.target.files[0]});
      handle.updatePicture(event.target.files[0]);
    };

    this.setState({ course:newCourse});

  }
  handleFileChange = event => {

  }
  updatePicture = (file) => {
    var handle = this;
    if(file instanceof Object){
      let reader = new FileReader();
      reader.onloadend = () => {
        handle.setState({bg_pic_data: reader.result});
      }
      reader.readAsDataURL(file);
      return;
    }

    //think it's a string
    handle.setState({bg_pic_data: file});


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
    if(this.state.loading){
      return <Notice content="Loading course ..." />;
    }

    //user is authenticated
    if(!this.props.isAuthenticated){
      return (<Notice content='User is not authenticated.' />);
    };

    //you need to be admin to see this for now
    if(!this.props.currentUser['cognito:groups'].includes('admin')){
      return <Notice content="You need to be admin to manage a course" />;

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
          <title>Course Builder for {this.state.course.name} - {config.site_name}</title>
        </Helmet>
        <Row>
          <Col>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/welcome">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Course Builder: {this.state.course.name}</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <h3>Settings</h3>
            <hr/>
          </Col>
          <Col xs="12">
            <Nav tabs className="d-flex justify-content-center">
              <NavItem>
                <NavLink className={ classnames({active:this.state.settingActiveTab==='general'})} onClick={() => {this.toggle('general');}}>General</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={ classnames({active:this.state.settingActiveTab==='pub_status'})} onClick={() => {this.toggle('pub_status');}}>Publication</NavLink>
              </NavItem>
              { /*
                  <NavItem>
                    <NavLink className={ classnames({active:this.state.settingActiveTab==='stats'})} onClick={() => {this.toggle('stats');}}>Stats</NavLink>
                  </NavItem>
                */ }
              <NavItem>
                <NavLink className={ classnames({active:this.state.settingActiveTab==='users'})} onClick={() => {this.toggle('users');}}>Users</NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.settingActiveTab}>
              <TabPane tabId='general'>
                <CourseForm {...this.state}
                  handleChange={this.handleChange} enableAddKeyPoint={this.enableAddKeyPoint} newKeyPoint={this.newKeyPoint}
                  handleUpdateCourse={this.handleUpdateCourse} deleteKeyPoint={this.deleteKeyPoint} validateGeneralForm={this.validateGeneralForm}
                  toggleCompany={this.toggleCompany}
                />
              </TabPane>
              <TabPane tabId='pub_status'>
                <FormGroup>
                  <Label>Publication Status</Label>
                  <Input type="select" id='status' value={this.state.course.status} onChange={this.handleChange}>
                    <option value='unpublished'>Not Published</option>
                    <option value='published'>Published</option>
                  </Input>
                </FormGroup>
                <Button color="primary" onClick={this.handleUpdateCourse}>Update publication status</Button>
              </TabPane>
              { /*
                <TabPane tabId='stats' className="mb-2">
                  <p>Warning: Not yet configured</p>
                  <ul>
                    <li>Distributed: {randomInt(40,540)} users </li>
                    <li>Started: {randomInt(40,540)} users </li>
                    <li>Finished: {randomInt(40,540)} users </li>
                  </ul>
                </TabPane>
              */
              }
              <TabPane tabId='users'>
                <CourseUsers {...this.state } {...this.props}/>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
        <CourseModules {...this.state} {...this.props}/>
      </Container>
    )
  }
}
