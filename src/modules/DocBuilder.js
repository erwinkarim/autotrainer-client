import React, { Component } from "react";
import { Container, Row, Col, FormText, FormGroup, Label, Input } from 'reactstrap';
import { Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import ModuleRootEditor from '../components/ModuleRootEditor';
import DocPreview from '../components/DocPreview';
import config from '../config.js';
import Notice from '../components/Notice';
import toTitleCase from 'titlecase';
import { invokeApig, s3Upload, s3Delete } from "../libs/awsLibs";
import Helmet from 'react-helmet'

export default class DocBuilder extends Component {
  constructor(props){
    super(props);
    this.state = {doc:null, file: '/us_constitution.pdf', loading:true}
  }
  componentDidMount = async () => {
    try{
      var result = await this.loadDoc();
      console.log('result', result);
      result.body = result.body === null || result.body === undefined ?
        {location:null, key:null } : result.body;
      var fileLoc = result.body.location;
      this.setState({doc:result, file:fileLoc, loading:false});
    } catch (e){
      console.log('error trying to get document');
      console.log(e);
    };

  }
  loadDoc = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path: `/modules/${this.props.match.params.moduleId}`,
      queryParams: {courseId:this.props.match.params.courseId}
    });
  }
  handleChange = (event) => {
    var newDoc = this.state.doc;
    if(event.target.id === "body") {
      //update the preview, but notify changes hasn't be saved yet
    } else {
      //title + desciprtion
      newDoc[event.target.id] =
        event.target.id === "title" ? toTitleCase(event.target.value) :
        event.target.value;
    };

    this.setState({ doc:newDoc});

  }
  handleFileChange = (e) => {
    if(e.target.files === undefined){
      //nothing is selected
      return;
    }

    var fileHandle = e.target.files[0];
    var handle = this;
    if(fileHandle.type !== "application/pdf"){
      console.log('Only support pdf files at this moment');
      handle.props.addNotification('Only pdf files are supported at this moment', 'danger');
      return;
    }

    this.setState({file:e.target.files[0]});
  }
  handleUpdateModule = async (e) => {
    console.log('should update title & description and upload file');
    var handle = this;

    //check file size
    if( handle.state.file instanceof File && handle.state.file.size > config.MAX_ATTACHMENT_SIZE){
      console.log('File must less than 5MB');
      handle.props.addNotification('Pdf size must be less than 5MB', 'danger');
      return;
    }

    //if file is different than current one in s3, upload first then update the doc object
    try{
      //upload if the file state becomes a file object
      if(handle.state.file instanceof Object){
        var newDoc = handle.state.doc;
        var oldKey = handle.state.doc.body.key;
        var newFile = await s3Upload(handle.state.file);
        newDoc.body = {location: newFile.Location, key:newFile.key};
        handle.setState({doc:newDoc, file:newFile.Location});

        //should delete the old file unless the old key is null
        if(oldKey !== null && oldKey !==  newFile.key){
          await s3Delete(oldKey);
        }
      }

      //update the title & description
      await handle.updateDoc();
      handle.props.addNotification('Module updated');

    } catch(e){
      console.log('error while uploading file / updating content');
      console.log(e);
    }
  }
  updateDoc = () => {
    //fn to update the docs
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      method: 'PUT',
      path: `/modules/${this.props.match.params.moduleId}`,
      queryParams: {courseId:this.props.match.params.courseId},
      body: this.state.doc
    });
  }
  validateForm = () => {
    //ensure title and description is filed and file is updated
    return this.state.doc.title.length > 0 &&
      this.state.doc.description.length > 0;
  }
  render(){
    if(this.state.loading){
      return <Notice content="Document is loading ..." />
    }
    
    if(this.props.currentUser === null){
      return (<Notice content="user Unauthorized" />);
    };

    if(this.state.doc === null){
      return (<Notice content="Document is not loaded yet ..."/>);
    };

    var fileName =
      this.state.doc.body === null ? '' : this.state.doc.body.location;
    return (
      <Container className="mt-3">
        <Helmet>
          <title>Doc Builder: {this.state.doc.title} - AutoTrainer</title>
        </Helmet>
        <Row>
          <Col sm="12">
            <Breadcrumb>
              <BreadcrumbItem tag={Link} to="/">Home</BreadcrumbItem>
              <BreadcrumbItem tag={Link} to="/welcome">{this.props.currentUser.name}</BreadcrumbItem>
              <BreadcrumbItem tag={Link} to={`/user/course_builder/${this.state.doc.courseId}`}>Course Builder: {this.state.doc.courseMeta.name}</BreadcrumbItem>
              <BreadcrumbItem active>Document Builder: {this.state.doc.title}</BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <ModuleRootEditor module={this.state.doc} handleChange={this.handleChange} />
          <Col md="8" className="text-left">
            <FormGroup>
              <Label>File Location</Label>
              <Input type="text" disabled={true} value={fileName} />
            </FormGroup>
            <FormGroup>
              <Label>File</Label>
              <Input type="file" onChange={this.handleFileChange} />
              <FormText>Supported file format: pdf</FormText>
              <FormText>File should be less than 5MB in size.</FormText>
            </FormGroup>
            <FormGroup>
              <Button type="button" color="primary" disabled={!this.validateForm()} onClick={this.handleUpdateModule}>Update Document</Button>
            </FormGroup>
          </Col>
        </Row>
        {
          this.state.file === null || this.state.file === undefined ?
            (<span>No file detected</span>) :
            <DocPreview file={this.state.file} showPath={true}/>
        }
        <Row className="text-left">
          <Col>
            <ul>Issues to address
              <li>Deleting old files when replace a file</li>
              <li>Button doesn't properly work in view mode</li>
              <li>Showing progress / loading when uploading file</li>
              <li>Key bind left/right arrows to page change</li>
            </ul>

          </Col>
        </Row>
      </Container>
    );
  }
}