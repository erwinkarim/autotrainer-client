import React, { Component } from "react";
import { Container, Col,  Row, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { FormGroup, Label, Input, FormText, Button} from 'reactstrap';
import { Card, CardBody, CardText, CardImg} from 'reactstrap';
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
    this.state = { video:null, url:'', convertedUrl:'', validVideo:false };
  }
  componentDidMount = async () => {
    try{
      var result = await this.loadVideo();
      result.body = result.body === null | result.body === undefined ?
        {origUrl:'', convertedUrl:'', description:''} :
        result.body;
      var validVideo = result.body.origUrl.length > 0 && result.body.convertedUrl.length > 0;
      this.setState({video:result, validVideo:validVideo});
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
  validateVideo = () => {
    //validate video.body.origUrl and convertedUrl
  }
  handleUpdateVideo = async (e) => {
    //update video button
    try {
      await this.updateVideo();
      this.props.addNotification('Video updated');

    } catch(e){
      console.log('error updating the video');
      console.log(e);
    }

  }
  updateVideo = () => {
    //return invokeApig promise
    return invokeApig({
      endpoint:config.apiGateway.MODULE_URL,
      method: 'PUT',
      path: `/modules/${this.props.match.params.moduleId}`,
      queryParams: {courseId:this.props.match.params.courseId},
      body: this.state.video
    });
  }
  validateForm = () => {
    //form validataion
    var video = this.state.video;

    return video.title.length > 0 &&
      video.description.length > 0 &&
      video.body.description.length > 0 &&
      this.state.validVideo;
  }
  handleChange = (event) => {
    var newVideo= this.state.video;
    if(event.target.id === "body") {
      //update the preview, but notify changes hasn't be saved yet
      newVideo.body[event.target.dataset.attr] = event.target.value;
    } else {
      //title + desciprtion
      newVideo[event.target.id] =
        event.target.id === "title" ? toTitleCase(event.target.value) :
        event.target.value;
    };

    this.setState({ video:newVideo});

  }
  handleVideoUrl = (e) => {
    //convert from youtube / vimeo url to embbed url
    var newVideo = this.state.video;
    console.log('target_url', e.target.value);
    var targetValue = e.target.value;

    try {
      var origUrl = new URL(targetValue);
      console.log('url_obj', origUrl);
      var videoUrl =
        origUrl.hostname === 'www.youtube.com' || origUrl.hostname === 'youtube.com' ?
          `https://www.youtube.com/embed/${origUrl.searchParams.get('v')}` :
        origUrl.hostname === 'www.vimeo.com' || origUrl.hostname === 'vimeo.com' ?
          `https://player.vimeo.com/video${origUrl.pathname}` :
        '';
      newVideo.body.origUrl = targetValue;
      newVideo.body.convertedUrl = videoUrl;
      //this.setState({url:origUrl, convertedUrl:videoUrl, validVideo:true});
      this.setState({video:newVideo, validVideo:true});
    } catch(e){
      console.log('error getting url name');
      newVideo.body.origUrl = targetValue;
      newVideo.body.convertedUrl = '';
      this.setState({video:newVideo, validVideo:false});
    };

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
            <FormGroup>
              <Label>Video URL Link</Label>
              <Input type="text" value={this.state.video.body.origUrl} onChange={this.handleVideoUrl} />
              <FormText color="muted">
                <ul>Valid formats are:-
                  <li>https://www.youtube.com/watch?v=XXXXXX</li>
                  <li>https://vimeo.com/XXXXXX</li>
                </ul>
              </FormText>
              <Label>Converted URL Link</Label>
              <Input type="text" disabled={true} value={this.state.video.body.convertedUrl} />
            </FormGroup>
            <FormGroup>
              <Label>Video Description</Label>
              <Input type="textarea" id="body" data-attr="description" value={this.state.video.body.description} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-left">
            <hr />
            <h4>Preview</h4>
            {
              this.state.validVideo ? (
                <Card>
                  <CardImg top tag="div" className="embed-responsive embed-responsive-16-by-9" style={ {height:'500px'}}>
                    <CardImg top tag="iframe" width="1600" src={this.state.video.body.convertedUrl} />
                  </CardImg>
                  {
                    this.state.video.body.description.length > 0 ?
                      <CardBody>{this.state.video.body.description.split('\n').map( (p,i) => <CardText key={i}>{p}</CardText>)}</CardBody> : ''
                  }
                </Card>
              ) : (<p>Video link is invalid</p>)
            }
          </Col>
          <Col md="12" className="mt-3 text-left">
            <Button type="button" color="primary" disabled={!this.validateForm()} onClick={this.handleUpdateVideo}>Update Video</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
