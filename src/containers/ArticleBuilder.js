import React, { Component } from "react";
import { Container, Row } from 'reactstrap'
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
import {MegadraftEditor, editorStateFromRaw, editorStateToJSON } from "megadraft";
import { ContentState, EditorState, convertFromHTML } from 'draft-js'

/*
  TODO:
    * custom image handler to wrap image in responsive card
    * video support (link / embed and wrap in responsive card)
    * table support
*/
export default class ArticleBuilder extends Component {
  constructor(props){
    super(props);
    //var startValue = '<p class="lead">start</p>';
    this.state = {article:null, loading:true,
      editorState: editorStateFromRaw(null)
    };
  }
  componentDidMount = async() => {
    var handle = this;

    //get the article
    try {
      var result = await this.getArticle();

      if(result.body === undefined){
        result.body = '';
      };

      console.log('result', result);

      //this will break older version
      // need to figure out how to handle this gracefully
      var newEditorState = result.body === '' ?
        editorStateFromRaw(null) :
      result.body.charAt(0) === '<' ?
        EditorState.createWithContent( ContentState.createFromBlockArray(
          convertFromHTML(result.body).contentBlocks,
          convertFromHTML(result.body).entityMap
        )) :
        editorStateFromRaw( JSON.parse(result.body) );

      console.log('newEditorState', newEditorState);

      handle.setState({article:result, loading:false, editorState:newEditorState });
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
    this.state.article.body = editorStateToJSON(this.state.editorState);

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
  toggleReadOnly = event => {
    this.setState({editorReadOnly:!this.state.editorReadOnly});
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
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/welcome">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={`/user/course_builder/${courseId}`}>Course Builder: {this.state.article.courseMeta.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Article Builder: {this.state.article.title}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <ModuleRootEditor module={this.state.article} handleChange={this.handleChange} />
          <div className="col-12 col-md-8">
            <FormGroup>
              <Label>Article Body</Label>
              <Card className="p-3">
                <MegadraftEditor editorState={this.state.editorState}
                  onChange={(editorState) => {this.setState({editorState});} }/>
              </Card>
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
