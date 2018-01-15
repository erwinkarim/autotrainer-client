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
      video:null, validVideo:false, enrolment:null, loading:true
    };
  }
  componentDidMount = async () => {
    try {
      var result = await this.loadVideo();
      result.body = result.body === null | result.body === undefined ?
        {origUrl:'', convertedUrl:'', description:''} :
        result.body;
      var validVideo = result.body.origUrl.length > 0 && result.body.convertedUrl.length > 0;
      this.setState({video:result, validVideo:validVideo, loading:false});


    } catch(e){
      console.log('error loading video');
      console.log(e);
    }

    //load enrolment
    try{
      result = await this.loadEnrolment();
      this.setState({enrolment:result});

    } catch(e){
      console.log('error is getting enrolment');
      console.log('ignore if you own this course');
      console.log(e);
    }

    //for now, trigger complete on video loaded,
    // in the future, will load the appropiate player, and trigger on watch complete
    try{
      if(this.state.enrolment !== null){
        if(!this.state.enrolment.progress.includes(this.state.video.moduleId)){
          await this.triggerComplete();
          this.props.addNotification('We remark that you have watched this video');

          //update enrolment
          result = await this.loadEnrolment();
          this.setState({enrolment:result});

        }
      }
    } catch(e){
      console.log('error updating enrolment');
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
  loadEnrolment = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path: `/enrolment/${this.state.video.courseId}`
    });
  }
  triggerComplete = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      method: 'POST',
      path: `/enrolment/${this.state.video.courseId}/attend/${this.state.video.moduleId}`
    })

  }
  render(){
    if(this.state.loading){
      return <Notice content="Video is loading ..." />

    }

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
                <BreadcrumbItem tag={Link} to="/welcome">{this.props.currentUser.name}</BreadcrumbItem>
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
                  <iframe src={video.body.convertedUrl} title={video.title} width="1600"></iframe>
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
