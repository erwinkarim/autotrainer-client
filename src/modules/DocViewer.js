import React, { Component } from "react";
import Notice from '../components/Notice';
import config from '../config.js';
import { invokeApig } from "../libs/awsLibs";
import { Container, Breadcrumb, BreadcrumbItem, Jumbotron} from 'reactstrap';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import DocPreview from '../components/DocPreview';

export default class DocViewer extends Component {
  constructor(props){
    super(props);

    this.state = {
      doc:null
    }
  }
  componentDidMount = async () => {
    try {
      var result = await this.loadDoc();
      var fileLoc = result.body === null || result.body === undefined ?
        null :
        result.body.location || result.body;
      this.setState({doc:result, file:fileLoc});
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
  render(){
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
          <title>{ this.state.doc.title } - AutoTrainer</title>
        </Helmet>
        <Container className="mt-2">
          <Breadcrumb>
            <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to="/user/landing">{ this.props.currentUser.name}</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/courses/toc/${doc.courseId}`}>{doc.courseMeta.name}</Link></BreadcrumbItem>
            <BreadcrumbItem active>Module X: {doc.title}</BreadcrumbItem>
          </Breadcrumb>
        </Container>
        <Jumbotron fluid>
          <Container>
            <h4 className="display-4">Chapter X: {doc.title}</h4>
            <p className="lead">{doc.description}</p>
          </Container>
        </Jumbotron>
        <Container>
          {
            doc.body === null ?
            <p>Document not configured. Contact author if you expecting a documment.</p> :
            <DocPreview file={this.state.file} />
          }
        </Container>
      </div>
    );
  }
}
