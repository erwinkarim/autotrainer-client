import React, { Component } from "react";
import Notice from '../components/Notice';
import config from '../config.js';
import { invokeApig } from "../libs/awsLibs";
import { Container, Row, Col, Jumbotron} from 'reactstrap';
import Helmet from 'react-helmet';
import DocPreview from '../components/DocPreview';
import CourseMenu from '../components/CourseMenu';

export default class DocViewer extends Component {
  constructor(props){
    super(props);

    this.state = {
      doc:null, enrolment:null, loading:true
    }
  }
  componentDidMount = async () => {
    var result = null;
    try {
      result = await this.loadEnrolment()
      this.setState({enrolment:result, loading:false});
    } catch(e){
      console.log('failed to get enrolment');
      console.log('ignore this is you own this course');
      console.log(e);
    }

    try {
      result = await this.loadDoc();
      var fileLoc = result.body === null || result.body === undefined ?
        null :
        result.body.location || result.body;
      this.setState({doc:result, file:fileLoc, loading:false});
    } catch(e){
      console.log('error in loading document');
      console.log(e);
    }
  }
  loadDoc = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path: `/modules/${this.props.match.params.moduleId}`,
      queryParams: {courseId:this.props.match.params.courseId}
    });
  }
  loadEnrolment = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path: `/enrolment/${this.props.match.params.courseId}`
    })
  }
  handleComplete = async () =>{
    console.log('should update module attandance');
    if(this.state.enrolment !== null){
      //check if already attend
      if(! this.state.enrolment.progress.includes( this.state.doc.moduleId)){
        try{
          //mark attendance if required
          var result = await this.notifyProgress();

          //notify course completion if required
          if(result.status === 0){
            this.props.addNotification('Course complete. View your certificate at the landing page');
          };

          //update enrolment state
          result = this.loadEnrolment();
          this.setState({enrolment:result});
          this.props.addNotification('We remark that you have read this document');
        } catch(e){
          console.log('error in updating enrolment status')
          console.log(e);
        }
      }
    }
  }
  notifyProgress = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      method: 'POST',
      path: `/enrolment/${this.state.doc.courseId}/attend/${this.state.doc.moduleId}`,
      body: {}
    });
  }
  render(){
    if(this.state.loading){
      return <Notice content="Document is loading ..." />
    };

    if(this.state.doc === null){
      return (<Notice content="Document not loaded" />);
    }

    if(this.props.currentUser === null){
      return (<Notice content="User not authororized" />);
    }

    var doc = this.state.doc;

    return (
      <div>
        <Helmet>
          <title>{ this.state.doc.title } - {config.site_name}</title>
        </Helmet>
        <Container><Row><Col><CourseMenu courseId={doc.courseId} moduleId={doc.moduleId} /></Col></Row></Container>
        <Jumbotron fluid>
          <Container>
            <h4 className="display-4">Chapter {doc.order}: {doc.title}</h4>
            <p className="lead">{doc.description}</p>
          </Container>
        </Jumbotron>
        <Container>
          {
            doc.body === null ?
            <p>Document not configured. Contact author if you expecting a documment.</p> :
            <DocPreview file={this.state.file} triggerComplete={this.handleComplete} />
          }
        </Container>
      </div>
    );
  }
}
