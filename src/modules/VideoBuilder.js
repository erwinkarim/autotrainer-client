import React, { Component } from "react";
import { Container, Col,  Row, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Link } from 'react-router-dom';
import toTitleCase from 'titlecase';
import ModuleRootEditor from '../components/ModuleRootEditor';
import Notice from '../components/Notice';
import Helmet from 'react-helmet';
import config from '../config.js';
import { invokeApig } from "../libs/awsLibs";

export default class VideoBuilder extends Component {
  constructor(props){
    super(props);
    this.state = { video:null };
  }
  componentDidMount = async () => {
    try{
      var result = await this.loadVideo();
      this.setState({video:result});
    } catch(e){
      console.log('error loading module');
      console.log(e);
    }
  }
  loadVideo = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path: `/modules/${this.props.match.params.moduleId}`,
      queryParams: {courseId:this.props.match.params.courseId}
    });
  }
  handleChange = (event) => {
    var newVideo= this.state.video;
    if(event.target.id === "body") {
      //update the preview, but notify changes hasn't be saved yet
    } else {
      //title + desciprtion
      newVideo[event.target.id] =
        event.target.id === "title" ? toTitleCase(event.target.value) :
        event.target.value;
    };

    this.setState({ video:newVideo});

  }
  render(){
    if(this.props.currentUser === null){
      return (<Notice content="user Unauthorized" />);
    };

    if(this.state.video === null){
      return (<Notice content="Video not loaded" />);
    };

    return (
      <Container className="mt-3">
        <Helmet>
          <title>Video Builder: { this.state.video.title } - AutoTrainer</title>
        </Helmet>
        <Row>
          <Col sm="12">
            <Breadcrumb>
              <BreadcrumbItem tag={Link} to="/">Home</BreadcrumbItem>
              <BreadcrumbItem tag={Link} to="/user/landing">{this.props.currentUser.name}</BreadcrumbItem>
              <BreadcrumbItem tag={Link} to={`/user/course_builder/${this.state.video.courseId}`}>Course Builder: {this.state.video.courseMeta.name}</BreadcrumbItem>
              <BreadcrumbItem active>Video Builder: {this.state.video.title}</BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <ModuleRootEditor module={this.state.video} handleChange={this.handleChange}/>
          <Col md="8" className="text-left">
            <p>Configure video here</p>
          </Col>
        </Row>
      </Container>
    );
  }
}
