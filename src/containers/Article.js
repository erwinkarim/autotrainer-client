import React, { Component } from "react";
//import AWS from 'aws-sdk';
import { Container, Row, Jumbotron, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import './Article.css';
import { Link } from 'react-router-dom';
import { invokeApig } from '../libs/awsLibs';
import Notice from '../components/Notice';
import Helmet from 'react-helmet';
import config from '../config';
import Waypoint from 'react-waypoint';
import Editor from '../components/Editor';

export default class Article extends Component {
  constructor(props){
    super(props);
    this.state = {article:null, enrolment:null, loading:true}
  }
  componentDidMount = async() => {
    var handle = this;

    try {
      var result = await this.loadArticle();
      //var newEditorState = editorStateFromRaw(JSON.parse(result.body) );
      handle.setState({article:result, loading:false});

    } catch(e){
      console.log('error fetching article');
      console.log(e);
    }

    //get enrolment status
    try {
      result = await this.getEnrolment();
      handle.setState({enrolment:result});

      //setup the editor once enrolment is confirmed
      this.editor.setEditorStateFromRaw(this.state.article.body);

    } catch(e){
      console.log('error getting enrolment status');
      console.log('ignore if you own this course');
      console.log(e);
    }

  }
  loadArticle = () => {
    return invokeApig({
      endpoint:config.apiGateway.MODULE_URL,
      path:`/modules/${this.props.match.params.articleId}`,
      queryParams: {courseId:this.props.match.params.courseId}
    });


  }
  getEnrolment = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path: `/enrolment/${this.state.article.courseId}`
    })
  }
  handleEnterViewport = async () => {
    var handle = this;
    console.log('should trigger class attended');
    /*
      1. check if progress has already been made
      2. send progress updates if necessary
    */
    if(this.state.enrolment !== null){
      //check if you already attend this article
      console.log('should check attendance');
      if( !handle.state.enrolment.progress.includes(handle.state.article.moduleId)){
        try {
          //check attendance
          console.log('notifyProgress');
          var result = await this.notifyProgress();

          this.props.addNotification('We remark that you have read this article');

          if(result.status === 0){
            this.props.addNotification('Course complete. View your certificate at the landing page');
          };

          //update the erolment
          console.log('get updated enrollment status');
          result = await this.getEnrolment();


          handle.setState({enrolment:result});

        } catch (e){
          console.log('error getting attendance');
          console.log(e);
        }
      } //if()
    }
  }
  notifyProgress = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      method: 'POST',
      path: `/enrolment/${this.state.article.courseId}/attend/${this.state.article.moduleId}`,
      body: {}
    })
  }
  render(){
    if(this.state.loading){
      return <Notice content="Article is loading ..."/>;
    }

    if(this.props.currentUser === null){
      return (<Notice title="Unauthorized" content="You have not logged in yet ..."/>);
    }

    if(this.state.article === null){
      return (<Notice content="Loading article ..." />);
    }

    /*
      ignore this is you are the owner ...
    */
    if(this.state.enrolment === null){
      return (<Notice content="You are not enrolled in this course ..." />);
    }

    /*
      TODO: make sure the accordion works
    */
    var article = this.state.article;
    return (
      <div className="text-left">
        <Helmet>
          <title>{ this.state.article.title } - {config.site_name}</title>
        </Helmet>
        <Container className="mt-2">
          <Breadcrumb>
            <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to="/welcome">{ this.props.currentUser.name}</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/courses/toc/${article.courseId}`}>{article.courseMeta.name}</Link></BreadcrumbItem>
            <BreadcrumbItem active>Module {article.order}: {article.title}</BreadcrumbItem>
          </Breadcrumb>
        </Container>
        <Jumbotron fluid>
          <Container>
            <h4 className="display-4">Chapter {article.order}: {article.title}</h4>
            <p className="lead">{article.description}</p>
          </Container>
        </Jumbotron>
        <Container>
          { /* actual */}
          <Row>
            <div className="col-12 col-md-8 text-justify">
              <Editor ref={ (editor) => {this.editor = editor;}} readOnly={true} />
            </div>
          </Row>
        </Container>

        <Waypoint onEnter={this.handleEnterViewport} />
      </div>
    )
  }
}
