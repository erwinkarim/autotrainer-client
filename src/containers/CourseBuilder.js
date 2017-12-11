import React, { Component } from "react";
import { Container, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import { FormGroup, Label,InputGroup, Input, InputGroupAddon, Button, Table }from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { Card, CardBody, CardTitle, CardText} from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import loremIpsum from 'lorem-ipsum';
import randomInt from 'random-int';
import toTitleCase from 'titlecase';
import FontAwesome from 'react-fontawesome';
import { invokeApig } from "../libs/awsLibs";
import Notice from '../components/Notice';
import './CourseBuilder.css';

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
      console.log('results', result);
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
  handleChange = event => {
    var newCourse = this.state.course;
    event.target.id === "key_points" ? (
      newCourse[event.target.id][parseInt(event.target.dataset.position)][event.target.dataset.key] =
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
    newCourse.key_points.splice(parseInt(e.target.dataset.position),1);
    this.setState(newCourse);
  }
  enableAddKeyPoint = () => {
    if(this.state.course.key_points === undefined){
      return true;
    }
    return this.state.course.key_points.length < 3;
  }
  render(){
    var note = (msg) => {
      return (<Container><Row>
          <div className="col-12 col-md-8">
            <p>{msg}</p>
          </div>
      </Row></Container>);
    }
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
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/user/landing">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Course Builder for {this.state.course.courseId}</BreadcrumbItem>
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
        <Row className="mt-3">
          <div className="col-12">
            <h3>Module Manager</h3>
            <hr/>
            <p>Warning: not yet implemented</p>
          </div>
          <div className="col-12 col-md-8">{ Array.from( Array(randomInt(3,8)).keys() ).map( (e,i) => {
            var result = 8 < randomInt(10) ? (
              <Card className="mb-2" key={i}>
                <CardBody>
                  <CardTitle tag="h3">Module {i+1}: {loremIpsum()}</CardTitle>
                  <ul>
                    <li> Questions: {randomInt(5,25)}</li>
                    <li> Style: {['Inline', 'Carousel'][randomInt(1)]}</li>
                  </ul>
                  <Link className="btn btn-primary mr-2" to="/courses/quiz">View Quiz</Link>
                  <Link className="btn btn-info" to="/user/quiz_builder">Edit Quiz</Link>
                </CardBody>
              </Card> ) : ( <Card key={i} className="mb-2">
                <CardBody>
                  <CardTitle tag="h3">Module {i+1}: {loremIpsum()}</CardTitle>
                  <CardTitle tag="h4">Stats</CardTitle>
                  <ul>
                    <li>Paragraphs: #{randomInt(2, 10) + 2}</li>
                    <li>Word Count: #{randomInt(200,20000)}</li>
                    <li>Pictures: #{randomInt(10)}</li>
                    <li>Videos: #{randomInt(10)}</li>
                    <li>Tables: #{randomInt(5)}</li>
                    <li>Estimate read time: #{randomInt(2, 7)} minutes</li>
                  </ul>
                  <CardTitle tag="h4">Preview</CardTitle>
                  <CardText className="lead">{loremIpsum()}</CardText>
                  <CardText >...</CardText>
                  <Link className="btn btn-primary mr-2" to="/courses/article">View Article</Link>
                  <Link className="btn btn-info" to="/user/article_builder">Edit Article</Link>
                </CardBody>
              </Card>);
            return result;

          })}</div>
          <div className="col-12">
            <Button type="button" color="primary">New Article</Button>
          </div>
        </Row>
      </Container>
    )
  }
}
