import React, { Component } from "react";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Jumbotron } from 'reactstrap'
import { Link } from 'react-router-dom';
import Notice from '../components/Notice';
import Helmet from 'react-helmet';
import config from '../config.js';
import { invokeApig } from "../libs/awsLibs";

export default class Video extends Component {
  constructor(props){
    super(props);
    this.state = {
      video:null, validVideo:false
    };
  }
  componentDidMount = async () => {
    try {
      var result = await this.loadVideo();
      result.body = result.body === null | result.body === undefined ?
        {origUrl:'', convertedUrl:'', description:''} :
        result.body;
      var validVideo = result.body.origUrl.length > 0 && result.body.convertedUrl.length > 0;
      this.setState({video:result, validVideo:validVideo});

    } catch(e){
      console.log('error loading video');
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
  render(){
    if(this.props.currentUser === null){
      return (<Notice content="user Unauthorized" />);
    };

    if(this.state.video === null){
      return <Notice content="Video not found / loading" />;
    }

    var video = this.state.video;

    return (
      <div className="mt-3">
        <Helmet>
          <title>Video: {video.title }- AutoTrainer</title>
        </Helmet>
        <Container>
          <Row>
            <Col sm="12">
              <Breadcrumb>
                <BreadcrumbItem tag={Link} to="/">Home</BreadcrumbItem>
                <BreadcrumbItem tag={Link} to="/user/landing">{this.props.currentUser.name}</BreadcrumbItem>
                <BreadcrumbItem><Link to={`/courses/toc/${video.courseId}`}>{video.courseMeta.name}</Link></BreadcrumbItem>
                <BreadcrumbItem active>Module X: {video.title}</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
        <Jumbotron fluid className="mb-0">
          <Container>
            <h4 className="display-4">Chapter X: {video.title}</h4>
            <p className="lead">{video.description}</p>
          </Container>
        </Jumbotron>
        <Jumbotron fluid>
          <Container>
            { this.state.validVideo ?
              <div>
                <div className="embed-responsive embed-responsive-16-by-9" style={ {height:'900px'}}>
                  <iframe src={video.body.convertedUrl} width="1600"></iframe>
                </div>
                { video.body.description.split('\n').map( (p,i) => <p key={i} className="text-left">{p}</p>)}
              </div>
              : <h4>Video is not valid</h4>
            }
          </Container>
        </Jumbotron>
      </div>
    );
  }
}
