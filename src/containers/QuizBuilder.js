import React, { Component } from "react";
import { Container, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
import { FormGroup, Input, Button } from 'reactstrap';
import ModuleRootEditor from '../components/ModuleRootEditor';
import {Link} from 'react-router-dom';
import randomInt from 'random-int';
import config from '../config.js';
import Notice from '../components/Notice';
import toTitleCase from 'titlecase';
import { invokeApig } from "../libs/awsLibs";
import Helmet from 'react-helmet'
import './QuizBuilder.css';

class QuestionForm extends Component {
  validateDelete = () => {
    return this.props.q.answers.length > 1;
  }
  render(){
    var rand_int = randomInt(100);
    return (
      <Card className="mb-2">
        <CardHeader className="d-flex justify-content-between">
          <span>Question {this.props.index+1}</span>
          <Button type="button" color="danger" size="sm"
            data-index={this.props.index}
            onClick={this.props.deleteQuestion} disabled={!this.props.validateDeleteQuestion()}>Delete Question</Button>
        </CardHeader>
        <CardBody>
          <CardText>Question: </CardText>
          <CardText>
            <Input type="textarea" rows="2" placeholder="Your question here."
              id="body" data-index={this.props.index} data-attr="question" value={this.props.q.question} onChange={this.props.handleChange}
            />
          </CardText>
          <Row>
            <div className="col-9">Potential answer:</div>
            <div className="col-2">Correct answer</div>
          </Row>
          {
            this.props.q.answers.map( (a, i2) => {
              return (
                <Row className="mb-1" key={i2}>
                  <div className="col-9">
                    <Input type="text" value={a}
                      id="body" data-index={this.props.index} data-attr="answers" data-aindex={i2} onChange={this.props.handleChange}
                    />
                  </div>
                  <div className="col-2 text-center">
                    <Input type="radio" name={`choice${rand_int}[]`} checked={i2 === this.props.q.answer_key}
                      id="body" data-index={this.props.index} data-attr="answer_key" value={i2}
                      onChange={this.props.handleChange}
                    />
                  </div>
                  <div className="col-1 px-0">
                    <Button type="button" color="danger" size="sm"
                    data-index={this.props.index} data-aindex={i2}
                    onClick={this.props.deleteAnswer} disabled={!this.validateDelete()}>X</Button>
                  </div>
                </Row>
              );
            })
          }
          <CardText><Button type="button" color="info" data-index={this.props.index} onClick={this.props.newAnswer}>New Answer</Button></CardText>
        </CardBody>
      </Card>
    );
  }

}
export default class QuizBuilder extends Component {
  constructor(props){
    super(props);
    this.state = {
      newQuestionMenu:false, quiz:null, loading:true
    };
  }
  componentDidMount = async () => {
    var handle = this;

    try {
      var result = await this.getQuiz();
      result.body = result.body === undefined || result.body === null ? [] : result.body;
      handle.setState({quiz:result, loading:false});
    } catch(e){
      console.log('error getting quiz');
      console.log(e);
    }

  }
  getQuiz = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path:`/modules/${this.props.match.params.moduleId}`,
      queryParams: {courseId:this.props.match.params.courseId}
    });
  }
  handleUpdateQuiz = async (e) => {
    console.log('should update quiz');
    try{
      await this.updateQuiz();
      console.log('quiz updated. should show up as notification');
      this.props.addNotification('Quiz updated ...')
    } catch(e){
      console.log('error updating quiz');
      console.log(e);
    }
  }
  updateQuiz = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      method: 'PUT',
      path: `/modules/${this.state.quiz.moduleId}`,
      queryParams: {courseId:this.state.quiz.courseId},
      body: this.state.quiz
    });
  }
  handleChange = (event) => {
    var newQuiz = this.state.quiz;
    if(event.target.id === "body") {
      //target the body, which part of the question body needs to be modified
      //newQuiz["body"][parseInt(event.target.dataset.index, 10)]["question"] = event.target.value ;
      var q_target = newQuiz["body"][parseInt(event.target.dataset.index,10)];
      event.target.dataset.attr === "question" ? q_target["question"] = event.target.value :
      event.target.dataset.attr === "answers" ? q_target["answers"][parseInt(event.target.dataset.aindex,10)] = event.target.value :
      event.target.dataset.attr === "answer_key" ? q_target["answer_key"] = parseInt(event.target.value,10) :
        console.log('q_target not found');
    } else {
      //title + desciprtion
      newQuiz[event.target.id] =
        event.target.id === "title" ? toTitleCase(event.target.value) :
        event.target.value;
    };

    this.setState({ quiz:newQuiz});

  }
  newQuestion = (e) => {
    var newQuiz = this.state.quiz;
    newQuiz.body.push({
      question:'', answers:[''], answer_key:0
    });
    this.setState({quiz:newQuiz});

  }
  newAnswer = (e) => {
    var newQuiz = this.state.quiz
    newQuiz["body"][parseInt(e.target.dataset.index,10)]["answers"].push('');
    this.setState({quiz:newQuiz});
  }
  deleteAnswer = (e) => {
    console.log('should delete answer');
    var newQuiz = this.state.quiz;
    var target_q = newQuiz["body"][e.target.dataset.index];
    var target_aindex = parseInt(e.target.dataset.aindex,10);
    target_q["answers"].splice(target_aindex,1);
    target_q["answer_key"] = target_q["answer_key"] === target_aindex ? 0 : target_q["answer_key"];
    this.setState({quiz:newQuiz});
  }
  deleteQuestion = (e) => {
    var newQuiz = this.state.quiz
    newQuiz["body"].splice( parseInt(e.target.dataset.index,10),1);
    this.setState({quiz:newQuiz});
  }
  validateDeleteQuestion = () => {
    return this.state.quiz.body.length > 1;
  }
  validateForm = () => {
    //form validation
    var validateTitle = this.state.quiz.title.length > 0;
    var validateDesc = this.state.quiz.description.length > 0;
    var validateQsLength = this.state.quiz.body.length > 0;
    var validateQs = this.state.quiz.body.reduce( (a,v) => {
      return a &&
        v.question.length > 0 &&
        v.answers.reduce( (a_a, a_v) => {
          return a_a && a_v.length > 0 }, true) &&
        v.answer_key !== null
    }, true);

    return validateTitle && validateDesc && validateQsLength && validateQs;
  }
  toggleNewQuestion = (e)=>{e.preventDefault(); this.setState({newQuestionMenu:!this.state.newQuestionMenu}); }
  render(){
    if(this.state.loading){
      return <Notice content="Quiz is loading ..."/>;
    }
    
    if(this.props.currentUser === null){
      return (<Notice title="Unauthorized" content="User not logged in"/>);
    };

    if(this.state.quiz === null){
      return (<Notice content="Quiz not loaded" />);
    }

    return (
      <Container className="text-left mt-2">
        <Helmet>
          <title>Quiz Builder: {this.state.quiz.title} - AutoTrainer</title>
        </Helmet>
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/welcome">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={`/user/course_builder/${this.state.quiz.courseId}`}>Course Builder: {this.state.quiz.courseMeta.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Quiz Builder: {this.state.quiz.title}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <ModuleRootEditor module={this.state.quiz} handleChange={this.handleChange} />
          <div className="col-12 col-md-8">
            <hr />
            <h6>Questions</h6>
            {
              this.state.quiz.body.length === 0 ? (
                <Card className="mb-2">
                  <CardBody>
                    <CardText>No questions yet. Begin by creating a question</CardText>
                  </CardBody>
                </Card>
              ) : (
                this.state.quiz.body.map( (q,i) => {
                  return ( <QuestionForm key={i} {...this.state} {...this.props}
                    q={q} index={i}
                    newAnswer={this.newAnswer} deleteAnswer={this.deleteAnswer}
                    handleChange={this.handleChange}
                    deleteQuestion={this.deleteQuestion} validateDeleteQuestion={this.validateDeleteQuestion}
                    />
                  );
                })
              )
            }
            <FormGroup>
              <Button type="button" color="primary" onClick={ this.newQuestion }>New Question</Button>
            </FormGroup>
            { /* TODO: the new questin will have a dropdown w/ choice of multiple choice, fill-in blanks and check all that is correct */}
            <Button type="button" color="primary" disabled={!this.validateForm()} onClick={this.handleUpdateQuiz}>Update Quiz</Button>
          </div>

        </Row>
      </Container>
    )
  }
}
