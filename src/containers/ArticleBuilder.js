import React, { Component } from "react";
import { Container, Row } from 'reactstrap'
import {Breadcrumb, BreadcrumbItem, FormGroup, Button, Label} from 'reactstrap';
import { Link } from 'react-router-dom';
import './ArticleBuilder.css';
import ModuleRootEditor from '../components/ModuleRootEditor';
import config from '../config.js';
import Notice from '../components/Notice';
import toTitleCase from 'titlecase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Helmet from 'react-helmet';
import { invokeApig } from "../libs/awsLibs";

export default class ArticleBuilder extends Component {
  /*
    TODO:
      * custom image handler to wrap image in responsive card
      * video support (link / embed and wrap in responsive card)
      * table support
  */
  modules =  {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote', 'code'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  }
  formats =  [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code',
    'list', 'bullet', 'indent',
    'link'
  ]
  constructor(props){
    super(props);
    this.state = {article:null};
  }
  componentDidMount = async() => {
    var handle = this;
    console.log('query', this.props.location);
    //get the article
    try {
      var result = await this.getArticle();
      if(result.body === undefined){
        result.body = '';
      }
      handle.setState({article:result});
    } catch(e){
      console.log('error getting the article');
      console.log(e);
    };

  }
  getArticle = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path:`/modules/${this.props.match.params.moduleId}`,
      queryParams: {courseId:this.props.match.params.courseId}
    });
  }
  handleChange = event => {
    var newArticle = this.state.article;
    newArticle[event.target.id] =
      event.target.id === "title" ? toTitleCase(event.target.value) :
      event.target.value;
    this.setState({ article:newArticle});
  }
  handleUpdate = async(e) => {
    //send update then view the module
    console.log('attempt to update article');

    try{
      await this.updateArticle();
      //TODO: add snackbar for this
      this.props.addNotification('Article updated ...');
      console.log('Sucessfully update article.');
    } catch(e){
      console.log('error in updating the article');
      console.log(e);
    }
  }
  updateArticle = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      method: 'PUT',
      path: `/modules/${this.props.match.params.moduleId}`,
      body: this.state.article,
      queryParams: {courseId:this.props.match.params.courseId}
    });
  }
  validateForm = () => {
    return this.state.article.title.length > 0 &&
      this.state.article.description.length > 0 &&
      this.state.article.body !== '<p><br></p>';
  }
  updateBody = (v) => {
    var newArticle = this.state.article;
    newArticle.body = v;
    this.setState({article:newArticle});
  }
  render(){
    //user is authenticated
    if(!this.props.isAuthenticated){
      return (<Notice content='User is not authenticated.' />);
    };

    if(this.state.article === null){
      return (<Notice content="Article not loaded..." />);
    };

    var courseId = this.props.match.params.courseId;

    return (
      <Container className="mt-2 text-left">
        <Helmet>
          <title>{`Building ${this.state.article.title} - AutoTrainer`}</title>
        </Helmet>
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/user/landing">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={`/user/course_builder/${courseId}`}>Course Builder: {this.state.article.courseMeta.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Article Builder: {this.state.article.title}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <ModuleRootEditor module={this.state.article} handleChange={this.handleChange} />
          <div className="col-12 col-md-8">
            <FormGroup>
              <Label>Article Body</Label>
              <p>Issues:</p>
              <ul>
                <li>getting picture element & wrapped in card</li>
                <li>getting video element & wrapped in card</li>
                <li>quote to work properly</li>
                <li>tables</li>
                <li>Other header options</li>
              </ul>
              <ReactQuill className="bodyBuilder" theme="snow" onChange={this.updateBody} value={this.state.article.body} id="body"
                modules={this.modules} formats={this.formats}
                placeholder="Start writting ... (Copy-paste picture to insert pictures)"
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" className="mr-2" onClick={this.handleUpdate} disabled={!this.validateForm()}>Update</Button>
              <Button color="danger">Cancel</Button>
            </FormGroup>
          </div>
        </Row>
      </Container>
    )
  }
}
