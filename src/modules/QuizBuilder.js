import React, { Component } from 'react';
import {
  Container, Row, Col, Breadcrumb, BreadcrumbItem,
  Card, CardHeader, CardBody, CardText,
  FormGroup, Input, Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import randomInt from 'random-int';
import Helmet from 'react-helmet';
import toTitleCase from 'titlecase';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import config from '../config';
import Notice from '../components/Notice';
import { invokeApig } from '../libs/awsLibs';
import ModuleRootEditor from '../components/ModuleRootEditor';

/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
const QuestionForm = (props) => {
  const validateDelete = props.q.answers.length > 1;
  const randInt = randomInt(100);
  return (
    <Card className="mb-2">
      <CardHeader className="d-flex justify-content-between">
        <span>Question {props.index + 1}</span>
        <Button
          type="button"
          color="danger"
          size="sm"
          data-index={props.index}
          onClick={props.deleteQuestion}
          disabled={!props.validateDeleteQuestion()}
        >Delete Question
        </Button>
      </CardHeader>
      <CardBody>
        <CardText>Question: </CardText>
        <CardText>
          <Input
            type="textarea"
            rows="2"
            placeholder="Your question here."
            id="body"
            data-index={props.index}
            data-attr="question"
            value={props.q.question}
            onChange={props.handleChange}
          />
        </CardText>
        <Row>
          <div className="col-8">Potential answer:</div>
          <div className="col-4 text-right">Correct answer</div>
        </Row>
        {
          props.q.answers.map((a, i2) => (
            <Row className="mb-1" key={parseInt(Math.random() * 1000, 10)}>
              <div className="col-9">
                <Input
                  type="text"
                  value={a}
                  id="body"
                  data-index={props.index}
                  data-attr="answers"
                  data-aindex={i2}
                  onChange={props.handleChange}
                />
              </div>
              <div className="col-2 text-center">
                <Input
                  type="radio"
                  name={`choice${randInt}[]`}
                  checked={i2 === props.q.answer_key}
                  id="body"
                  data-index={props.index}
                  data-attr="answer_key"
                  value={i2}
                  onChange={props.handleChange}
                />
              </div>
              <div className="col-1 px-0">
                <Button
                  type="button"
                  color="danger"
                  size="sm"
                  data-index={props.index}
                  data-aindex={i2}
                  onClick={props.deleteAnswer}
                  disabled={!validateDelete}
                >X
                </Button>
              </div>
            </Row>
          ))
        }
        <CardText><Button type="button" color="info" data-index={props.index} onClick={props.newAnswer}>New Answer</Button></CardText>
      </CardBody>
    </Card>
  );
};

QuestionForm.propTypes = {
  q: PropTypes.shape().isRequired,
  index: PropTypes.number.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  deleteAnswer: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  newAnswer: PropTypes.func.isRequired,
  validateDeleteQuestion: PropTypes.func.isRequired,
};

/**
 * The Constructor
 * @param {json} e the props
 * @returns {null} The sum of the two numbers.
 */
export default class QuizBuilder extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      newQuestionMenu: false, quiz: null, loading: true,
    };
  }
  componentDidMount = async () => {
    const handle = this;

    try {
      const result = await this.getQuiz();
      result.body = result.body === undefined || result.body === null ? [] : result.body;

      // handle create uniq id if there isn't one
      if (result.body.length > 0) {
        result.body.forEach((e) => { e.id = uuid.v4(); });
      }
      handle.setState({ quiz: result, loading: false });
    } catch (e) {
      console.log('error getting quiz');
      console.log(e);
    }
  }
  getQuiz = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: `/modules/${this.props.match.params.moduleId}`,
    queryParams: { courseId: this.props.match.params.courseId },
  })
  handleUpdateQuiz = async () => {
    console.log('should update quiz');
    try {
      await this.updateQuiz();
      console.log('quiz updated. should show up as notification');
      this.props.addNotification('Quiz updated ...');
    } catch (err) {
      console.log('error updating quiz');
      console.log(err);
    }
  }
  updateQuiz = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    method: 'PUT',
    path: `/modules/${this.state.quiz.moduleId}`,
    queryParams: { courseId: this.state.quiz.courseId },
    body: this.state.quiz,
  })
  handleChange = (e) => {
    const newQuiz = this.state.quiz;
    if (e.target.id === 'body') {
      // target the body, which part of the question body needs to be modified
      // newQuiz["body"][parseInt(event.target.dataset.index, 10)]["question"]
      // = event.target.value ;
      const qTarget = newQuiz.body[parseInt(e.target.dataset.index, 10)];
      switch (e.target.dataset.attr) {
        case 'question':
          qTarget.question = e.target.value;
          break;
        case 'answers':
          qTarget.answers[parseInt(e.target.dataset.aindex, 10)] = e.target.value;
          break;
        case 'answer_key':
          qTarget.answer_key = parseInt(e.target.value, 10);
          break;
        default:
          console.log('q_target not found');
      }
    } else {
      // title + desciprtion
      newQuiz[e.target.id] =
        e.target.id === 'title' ? toTitleCase(e.target.value) :
          e.target.value;
    }

    this.setState({ quiz: newQuiz });
  }
  newQuestion = () => {
    const newQuiz = this.state.quiz;
    newQuiz.body.push({
      id: uuid.v4(), question: '', answers: [''], answer_key: 0,
    });
    this.setState({ quiz: newQuiz });
  }
  newAnswer = (e) => {
    const newQuiz = this.state.quiz;
    newQuiz.body[parseInt(e.target.dataset.index, 10)].answers.push('');
    this.setState({ quiz: newQuiz });
  }
  deleteAnswer = (e) => {
    console.log('should delete answer');
    const newQuiz = this.state.quiz;
    const targetQ = newQuiz.body[e.target.dataset.index];
    const targetAindex = parseInt(e.target.dataset.aindex, 10);
    targetQ.answers.splice(targetAindex, 1);
    targetQ.answer_key = targetQ.answer_key === targetAindex ? 0 : targetQ.answer_key;
    this.setState({ quiz: newQuiz });
  }
  deleteQuestion = (e) => {
    const newQuiz = this.state.quiz;
    newQuiz.body.splice(parseInt(e.target.dataset.index, 10), 1);
    this.setState({ quiz: newQuiz });
  }
  validateDeleteQuestion = () => this.state.quiz.body.length > 1
  validateForm = () => {
    // form validation
    const validateTitle = this.state.quiz.title.length > 0;
    const validateDesc = this.state.quiz.description.length > 0;
    const validateQsLength = this.state.quiz.body.length > 0;
    const validateQs = this.state.quiz.body.reduce(
      (a, v) => a &&
        v.question.length > 0 &&
        v.answers.reduce((aA, aV) => aA && aV.length > 0, true) &&
        v.answer_key !== null
      , true,
    );

    return validateTitle && validateDesc && validateQsLength && validateQs;
  }
  toggleNewQuestion = (e) => {
    e.preventDefault();
    this.setState({ newQuestionMenu: !this.state.newQuestionMenu });
  }
  render = () => {
    if (this.state.loading) {
      return <Notice content="Quiz is loading ..." />;
    }

    if (this.props.currentUser === null) {
      return <Notice title="Unauthorized" content="User not logged in" />;
    }

    if (this.state.quiz === null) {
      return (<Notice content="Quiz not loaded" />);
    }

    return (
      <Container className="text-left mt-2">
        <Helmet>
          <title>Quiz Builder: {this.state.quiz.title} - {config.site_name}</title>
        </Helmet>
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link href="/" to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link href="/" to="/welcome">{this.props.currentUser.name}</Link></BreadcrumbItem>
              <BreadcrumbItem><Link href="/" to={`/user/course_builder/${this.state.quiz.courseId}`}>Course Builder: {this.state.quiz.courseMeta.name}</Link></BreadcrumbItem>
              <BreadcrumbItem active>Quiz Builder: {this.state.quiz.title}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <ModuleRootEditor module={this.state.quiz} handleChange={this.handleChange} />
          <Col xs="12" md="12" lg="8">
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
                this.state.quiz.body.map((q, i) => (
                  <QuestionForm
                    key={q.id}
                    {...this.state}
                    {...this.props}
                    q={q}
                    index={i}
                    newAnswer={this.newAnswer}
                    deleteAnswer={this.deleteAnswer}
                    handleChange={this.handleChange}
                    deleteQuestion={this.deleteQuestion}
                    validateDeleteQuestion={this.validateDeleteQuestion}
                  />
                ))
              )
            }
            <FormGroup>
              <Button type="button" color="primary" onClick={this.newQuestion}>New Question</Button>
            </FormGroup>
            { /*
              TODO: the new questin will have a dropdown w/ choice of multiple choice,
              fill-in blanks and check all that is correct
            */}
            <Button type="button" color="primary" disabled={!this.validateForm()} onClick={this.handleUpdateQuiz}>Update Quiz</Button>
          </Col>

        </Row>
      </Container>
    );
  }
}

QuizBuilder.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape(),
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  currentUser: PropTypes.shape(),
};

QuizBuilder.defaultProps = {
  currentUser: {},
};
