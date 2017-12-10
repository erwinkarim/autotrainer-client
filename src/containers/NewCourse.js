import React, { Component } from "react";
import {Container, Row, Form, FormGroup, Input, Breadcrumb, BreadcrumbItem, Button} from 'reactstrap';
import { Link } from "react-router-dom";
import './NewCourse.css'
import { invokeApig } from "../libs/awsLibs";

export default class NewCourse extends Component {
  constructor(props){
    super(props);
    this.state = {title:'', description:''};
  }
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleSubmit = async(e) => {
    e.preventDefault();

    try {
      console.log('attempt to createCourse');
      var result = await this.createCourse({
        name: this.state.title,
        description: this.state.description
      });
      console.log(result);
      this.props.history.push("/");
    } catch (e) {
      console.log(e);
    };
  }
  createCourse = (course) => {
    console.log('attempt to call invokeApig');
    return invokeApig({
      path: "/courses",
      method: "POST",
      body: course
    });

  }
  validateForm = () => {
    return (this.state.title.length > 0 && this.state.description.length > 0);
  }
  render(){
    if(!this.props.isAuthenticated){
      return (<div>User is not authenticated</div>);
    }

    return (<Container className="mt-2">
      <Breadcrumb>
        <BreadcrumbItem tag={Link} to="/">Home</BreadcrumbItem>
        <BreadcrumbItem tag={Link} to="/user/landing">{this.props.currentUser.name}</BreadcrumbItem>
        <BreadcrumbItem active>New Course</BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <div className="col-12 col-md-8 text-left">
          <h3>
            New Course
            <small className="text-muted"> Enter details to kick things off.</small>
          </h3>
        </div>
        <div className="col-12 col-md-8">
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Input id="title" type="text" placeholder="Course Title. Should be less than 140 characters"
                maxLength="140" value={this.state.title} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input id="description" type="textarea" rows="20" placeholder="Description about the course..."
                value={this.state.description} onChange={this.handleChange} />
            </FormGroup>
            <Button color="primary" disabled={!this.validateForm()}>Create Course</Button>
          </Form>
        </div>
      </Row>
    </Container>);
  }
}
