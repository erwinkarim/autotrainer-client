import React, { Component } from "react";
import { Container, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import { FormGroup, Label, Input, Button, Table }from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { Card, CardBody, CardTitle, CardText} from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import loremIpsum from 'lorem-ipsum';
import randomInt from 'random-int';
import { invokeApig } from "../libs/awsLibs";
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
      this.props.history.push(`/courses/toc/${this.state.course.courseId}`);
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
    newCourse[event.target.id] = event.target.value;
    this.setState({ course:newCourse});
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
      return note('User is not authenticated yet ...')
    };

    //course has been loaded
    if(this.state.course === null){
      return note('Course is note loaded yet ...')
    }

    //TODO: check course belongs to the current user

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
            <h3 className="display-4">Settings</h3>
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
                <FormGroup>
                  <Label>Name</Label>
                  <Input type="text" placeholder="Course Name" id="name" value={this.state.course.name} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <Input type="textarea" rows="20" id="description" value={this.state.course.description} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Price</Label>
                  <Input type="number" id="price" onChange={this.handleChange} value={this.state.course.price} />
                </FormGroup>
                <Button color="primary" onClick={this.handleUpdateCourse}>Update Course Setting</Button>
              </TabPane>
              <TabPane tabId='stats'>
                <h4 className="display-4">User Stats</h4>
                <ul>
                  <li>Distributed: {randomInt(40,540)} users </li>
                  <li>Started: {randomInt(40,540)} users </li>
                  <li>Finished: {randomInt(40,540)} users </li>
                </ul>
              </TabPane>
              <TabPane tabId='users'>
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
        <Row>
          <div className="col-12">
            <h3 className="display-4">Module Manager</h3>
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
        </Row>
      </Container>
    )
  }
}
