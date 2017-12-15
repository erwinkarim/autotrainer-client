import React, { Component } from "react";
import { Container, Row } from 'reactstrap'
import {Breadcrumb, BreadcrumbItem, FormGroup, Input, InputGroup, InputGroupAddon, Button, Label} from 'reactstrap';
import { Link } from 'react-router-dom';
import './ArticleBuilder.css';
import config from '../config.js';
import Notice from '../components/Notice';
import toTitleCase from 'titlecase';
import { invokeApig } from "../libs/awsLibs";


export default class ArticleBuilder extends Component {
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
      this.state.article.body.length > 0;
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
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/user/landing">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={`/user/course_builder/${courseId}`}>Course Builder: {this.state.article.courseMeta.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Article Builder: {this.state.article.title}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="col-12 col-md-8">
            <h3>Article Builder</h3>
            <p>Put react draft here</p>
            <FormGroup>
              <Label>Title</Label>
              <InputGroup>
                <Input type="text" maxLength="140" placeholder="Title for the article. Should be less than 140 characters"
                  id="title" value={this.state.article.title} onChange={this.handleChange}/>
                <InputGroupAddon>{ 140 - this.state.article.title.length}</InputGroupAddon>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input type="textarea" rows="5" id="description"
                value={this.state.article.description} onChange={this.handleChange} placeholder="Short summary about this article"/>
            </FormGroup>
            <FormGroup>
              <Label>Article Body</Label>
              { /* change to react draft or other WYSIWYG canidates*/}
              <Input type="textarea" rows="25" placeholder="The article body. Say your piece here"
                id="body" value={this.state.article.body} onChange={this.handleChange}
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
