import React, { Component } from "react";
import { Container, Row, Col } from 'reactstrap'
import {Breadcrumb, BreadcrumbItem, FormGroup, Button, Label } from 'reactstrap';
import {Card} from 'reactstrap';
import { Link } from 'react-router-dom';
import './Article.css';
import ModuleRootEditor from '../components/ModuleRootEditor';
import config from '../config.js';
import Notice from '../components/Notice';
import toTitleCase from 'titlecase';
import Helmet from 'react-helmet';
import { invokeApig } from "../libs/awsLibs";
import Editor from '../components/Editor';

/*
  TODO:
    * table support
    * step-by-step accordion support
*/


export default class ArticleBuilder extends Component {
  constructor(props){
    super(props);
    //var startValue = '<p class="lead">start</p>';
    this.state = {article:null, loading:true };
  }
  componentDidMount = async() => {
    var handle = this;

    //get the article
    try {
      var result = await this.getArticle();

      if(result.body === undefined){
        result.body = '';
      };

      //this will break older version
      // need to figure out how to handle this gracefully
      handle.setState({article:result, loading:false });
      this.editor.setEditorStateFromRaw(result.body);

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

    //set the state body to raw first
    //this.state.article.body = editorStateToJSON(this.state.editorState);
    this.state.article.body = this.editor.getRaw();

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
    console.log('validate', this.editor);

    /*
    if(!this.editor){
      return false;
    };
    */

    return this.state.article.title.length > 0 &&
      this.state.article.description.length > 0
      //this.state.editorState.getCurrentContent().hasText() &&
      //this.editor.hasText();
      //this.state.article.body !== '';
  }
  render(){
    //check auth
    if(!this.props.isAuthenticated){
      return (<Notice content='User is not authenticated.' />);
    };

    if(this.state.loading){
      return <Notice content="Article is loading ..."/>;
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
          <Col xs="12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/welcome">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={`/user/course_builder/${courseId}`}>Course Builder: {this.state.article.courseMeta.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Article Builder: {this.state.article.title}</BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <ModuleRootEditor module={this.state.article} handleChange={this.handleChange} />
          <Col xs={ {size:11, offset:1}} sm={ {size:12, offset:0} } lg={ {size:8, offset:0}} >
            <FormGroup>
              <Label>Article Body</Label>
              <Card className="p-3">
                <Editor ref={ (editor) => {this.editor = editor;}} />
              </Card>
            </FormGroup>
            <FormGroup>
              <Button color="primary" className="mr-2" onClick={this.handleUpdate} disabled={!this.validateForm()}>Update</Button>
              <Button color="danger">Cancel</Button>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    )
  }
}
