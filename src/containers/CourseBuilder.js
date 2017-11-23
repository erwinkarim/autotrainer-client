import React, { Component } from "react";
import { Container, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import { FormGroup, Label, Input, Button, Table }from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { Card, CardBody, CardTitle, CardText} from 'reactstrap';
import classnames from 'classnames';
import loremIpsum from 'lorem-ipsum';
import randomInt from 'random-int';
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
    this.state = {settingActiveTab:'general', userDropdownOpen:false };
  }
  toggle = (tab) => {
    if(this.state.settingActiveTab !== tab){
      this.setState({settingActiveTab:tab});
    }
  }
  render(){
    return (
      <Container className="mt-2 text-left">
        <Row>
          <div className="col-12">
            <Breadcrumb nav>
              <BreadcrumbItem tag="a" href="/">Home</BreadcrumbItem>
              <BreadcrumbItem tag="a" href="/user/landing">FirstName LastName</BreadcrumbItem>
              <BreadcrumbItem active>Course Builder</BreadcrumbItem>
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
                  <Input type="text" placeholder="Course Name"/>
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <Input type="textarea" rows="20">{loremIpsum()}</Input>
                </FormGroup>
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
                    return (<tr>
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
            <h3 className="display-4">Content Manager</h3>
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
                  <Button color="primary" className="mr-2">View Quiz</Button>
                  <Button color="info">Edit Quiz</Button>
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
                  <Button color="primary" className="mr-2">View Article</Button>
                  <Button color="info">Edit Article</Button>
                </CardBody>
              </Card>);
            return result;

          })}</div>
        </Row>
      </Container>
    )
  }
}
