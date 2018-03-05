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
    this.state = {quiz:null, answers:[], ansChecked:false, enrolment:null, loading:true};
  }
  componentDidMount = async(e) => {
    var handle = this;
    try {
      console.log('attemp to load quiz');
      var result = await this.loadQuiz();
      handle.setState({quiz:result, answers:Array.from(Array(result.body.length)), checkAnswer:false, loading:false});
    } catch(e){
      console.log('error getting quiz');
      console.log(e);
    }

    //load enrolment
    try {
      result = await this.loadEnrolment();
      this.setState({enrolment:result});
    } catch(e){
      console.log('error getting enrolment');
      console.log('ignore this if you own this course');
      console.log(e);
    }

    //update current answers if available
    if(this.state.enrolment !== null){
      if(this.state.enrolment.progress_detail === undefined){
        return;
      }

      var progress_detail = this.state.enrolment.progress_detail;
      var current_progress = progress_detail.find(
        (e) => Object.keys(e)[0] === this.state.quiz.moduleId
      );
      if(current_progress){
        try {
          var current_answers = JSON.parse(current_progress[this.state.quiz.moduleId]).current_answers;
          this.setState({answers:current_answers});
        } catch(e){
          console.log('error parsing JSON');
        }
      }
    }
  }
  loadQuiz = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path:`/modules/${this.props.match.params.moduleId}`,
      queryParams: {courseId:this.props.match.params.courseId}
    });

  }
  loadEnrolment = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path:`/enrolment/${this.state.quiz.courseId}`,
    });
  }
  recordAnswer = async (e) => {
    console.log('should record answer');
    var newAnswer = this.state.answers;
    newAnswer[parseInt(e.target.dataset.qindex,10)] =  parseInt(e.target.dataset.aindex,10);
    this.setState({answers:newAnswer});
    //record attendance when all question are answered
    if( newAnswer.reduce( (a,v) => v !== undefined ? a+1 : a+0,0) === this.state.quiz.body.length){
      this.triggerComplete();
    }

    //update answer to the db
    try {
      console.log('attemp to nofity progress detail');
      await this.notifyProgressDetail();

    } catch(e){
      console.log('error updating enrolment progress detail');
      console.log('ignore this if you own this course');
      console.log(e);
    }


  }
  triggerComplete = async () => {
    console.log('should record attend class');
    if(this.state.enrolment !== null){
      try{
        if(! this.state.enrolment.progress.includes(this.state.quiz.moduleId)){
          //notify attendance
          var result = await this.notifyProgress();

          //should notify if course completed
          if(result.status === 0){
            this.props.addNotification('Course complete. View your certificate at the landing page');
          };

          //update enrolment progress
          result = await this.loadEnrolment();
          this.setState({enrolment:result});

          this.props.addNotification('We remark that you have completed this quiz');
        }
      } catch(e){
        console.log('error notifying progress');
        console.log(e);
      }
    }
  }
  notifyProgress = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      method: 'POST',
      path: `/enrolment/${this.state.quiz.courseId}/attend/${this.state.quiz.moduleId}`,
      body: {}
    })
  }
  notifyProgressDetail = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      method: 'POST',
      path: `/enrolment/${this.state.quiz.courseId}/mark_progress/${this.state.quiz.moduleId}`,
      body: {
        current_answers: this.state.answers
      }
    })
  }
  checkAnswer = (e) => {
    this.setState({checkAnswer:true});
  }
  /*
    TODO: stop render new things everytime you cilck something
  */
  render(){
    if(this.state.loading){
      return <Notice content="Quiz is loading ..."/>;
    }

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
          <title>{this.state.quiz.title} - {config.site_name}</title>
        </Helmet>
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/welcome">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={`/courses/toc/${this.state.quiz.courseId}`}>{this.state.quiz.courseMeta.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Module {this.state.quiz.order}: {this.state.quiz.title}</BreadcrumbItem>
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
                                checked={this.state.answers[i] === i2 }
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
