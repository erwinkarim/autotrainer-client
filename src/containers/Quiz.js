import React, { Component } from "react";
import { Container,  Row, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import {  Card, CardBody, CardText, Button} from 'reactstrap';
import {FormGroup, Label, Input} from 'reactstrap';
import {Nav, Navbar, NavItem} from 'reactstrap';
import { Link } from 'react-router-dom';
import Notice from '../components/Notice'
import config from '../config.js';
import { invokeApig } from "../libs/awsLibs";
import Helmet from 'react-helmet'
import Sticky from 'react-sticky-el';
import './Quiz.css';


export default class Quiz extends Component {
  constructor(props){
    super(props);
    this.state = {quiz:null, answers:[], ansChecked:false};
  }
  componentDidMount = async(e) => {
    var handle = this;
    try {
      console.log('attemp to load quiz');
      var result = await this.loadQuiz();
      handle.setState({quiz:result, answers:Array.from(Array(result.body.length)), checkAnswer:false});
    } catch(e){
      console.log('error getting quiz');
      console.log(e);
    }

  }
  loadQuiz = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path:`/modules/${this.props.match.params.moduleId}`,
      queryParams: {courseId:this.props.match.params.courseId}
    });

  }
  recordAnswer = (e) => {
    console.log('should record answer');
    var newAnswer = this.state.answers;
    newAnswer[parseInt(e.target.dataset.qindex,10)] =  parseInt(e.target.dataset.aindex,10);
    this.setState({answers:newAnswer});
  }
  checkAnswer = (e) => {
    this.setState({checkAnswer:true});
  }
  /*
    TODO: stop render new things everytime you cilck something
  */
  render(){
    if(this.props.currentUser === null){
      return (<Notice content="Not logged in" />);
    }

    if(this.state.quiz === null){
      return (<Notice content="Quiz not loaded" />);
    }

    var answeredQ = this.state.answers.reduce( (a,v) => v !== undefined ? a+1 : a+0,0);
    var correctAnswer = this.state.answers.reduce( (a,v,i) => v === this.state.quiz.body[i].answer_key ? a+1 : a+0, 0);

    return (
      <Container className="mt-2 text-left">
        <Helmet>
          <title>{this.state.quiz.title} - AutoTrainer</title>
        </Helmet>
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/user/landing">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={`/courses/toc/${this.state.quiz.courseId}`}>{this.state.quiz.courseMeta.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Module X: {this.state.quiz.title}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="col-12 col-md-8 mb-3">
            <Sticky style={ {zIndex:100}}>
              <Navbar color="light" dark>
                <Nav navbar>
                  <NavItem>{
                    this.state.quiz.body.length !== answeredQ ?
                      (<span>Answered {answeredQ} of {this.state.quiz.body.length} questions.</span>) :
                    !this.state.checkAnswer ?
                      (<span>Answred all questions! <Button color="primary" outline size="sm" onClick={this.checkAnswer}>Check?</Button></span>) :
                      (<span>Answered {correctAnswer} of {this.state.quiz.body.length} correctly.</span>)
                  }</NavItem>
                </Nav>
              </Navbar>
            </Sticky>
          </div>
          <div className="col-12 col-md-8">{
            this.state.quiz.body.map( (q,i) => {
              var answerCorrectly = this.state.checkAnswer ?
                this.state.quiz.body[i].answer_key === this.state.answers[i]
               : null;
              var borderColor = answerCorrectly !== null ?
                (answerCorrectly ? 'border border-success' : 'border border-danger') :
                null;
              return (
                <Card key={i} className={`mb-3 ${borderColor}`}>
                  <CardBody>
                    <CardText>Question {i+1}:</CardText>
                    <CardText className="lead">{ q.question}</CardText>
                    {
                      q.answers.map( (a, i2) => {
                        return (
                          <FormGroup key={i2}>
                            <Label check disabled={this.state.checkAnswer}>
                              <Input type="radio" name={`q${i+1}-answer[]`} data-qindex={i} data-aindex={i2} onClick={this.recordAnswer}
                                disabled={this.state.checkAnswer} />
                              {a}
                              {
                                this.state.checkAnswer ?
                                  this.state.quiz.body[i].answer_key === i2 ? <span className="text-success"> - Correct answer</span> : null
                                : null
                              }
                            </Label>
                          </FormGroup>
                        )
                      })
                    }
                  </CardBody>
                </Card>
              );
            })
          }</div>
        </Row>
      </Container>
    );
  }
}
