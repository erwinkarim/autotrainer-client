import React, { Component } from 'react';
import {
  Row, Col, Card, CardHeader, CardBody, CardText,
  FormGroup, Input, Button,
} from 'reactstrap';
import randomInt from 'random-int';
import PropTypes from 'prop-types';
import uuid from 'uuid';

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
            <Row className="mb-1" key={i2}>
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

const defaultBody = [];
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
  componentDidMount = async () => {
    const { module } = this.props;

    if (!module.body) {
      this.props.handleBodyUpdate(defaultBody);
    }

    if (module.body.length > 0) {
      // check if there's a id on each q, otherwise add one and update
      if (!module.body[0].id) {
        const newBody = module.body;
        newBody.forEach((e) => {
          e.id = uuid.v4();
        });
        this.props.handleBodyUpdate(newBody);
      }
    }
  }
  handleChange = (e) => {
    const newQuiz = this.props.module.body;
    // target the body, which part of the question body needs to be modified
    // newQuiz["body"][parseInt(event.target.dataset.index, 10)]["question"]
    // = event.target.value ;
    const qTarget = newQuiz[parseInt(e.target.dataset.index, 10)];
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

    this.props.handleBodyUpdate(newQuiz);
  }
  newQuestion = () => {
    const newQuiz = this.props.module.body;
    newQuiz.push({
      id: uuid.v4(), question: '', answers: [''], answer_key: 0,
    });
    this.props.handleBodyUpdate(newQuiz);
  }
  newAnswer = (e) => {
    const newQuiz = this.props.module.body;
    newQuiz[parseInt(e.target.dataset.index, 10)].answers.push('');
    this.props.handleBodyUpdate(newQuiz);
  }
  deleteAnswer = (e) => {
    console.log('should delete answer');
    const newQuiz = this.props.module.body;
    const targetQ = newQuiz[e.target.dataset.index];
    const targetAindex = parseInt(e.target.dataset.aindex, 10);
    targetQ.answers.splice(targetAindex, 1);
    targetQ.answer_key = targetQ.answer_key === targetAindex ? 0 : targetQ.answer_key;
    this.props.handleBodyUpdate(newQuiz);
  }
  deleteQuestion = (e) => {
    const newQuiz = this.props.module.body;
    newQuiz.splice(parseInt(e.target.dataset.index, 10), 1);
    this.props.handleBodyUpdate(newQuiz);
  }
  validateDeleteQuestion = () => this.props.module.body.length > 1
  validBody = () => {
    // form validation
    const validateQsLength = this.props.module.body.length > 0;
    const validateQs = this.props.module.body.reduce(
      (a, v) => a &&
        v.question.length > 0 &&
        v.answers.reduce((aA, aV) => aA && aV.length > 0, true) &&
        v.answer_key !== null
      , true,
    );

    return validateQsLength && validateQs;
  }
  render = () => (
    <div className="text-left mt-2">
      <Row>
        <Col xs="12" md="12" lg="8">
          <hr />
          <h6>Questions</h6>
          {
            this.props.module.body === undefined || this.props.module.body.length === 0 ? (
              <Card className="mb-2">
                <CardBody>
                  <CardText>No questions yet. Begin by creating a question</CardText>
                </CardBody>
              </Card>
            ) : (
              this.props.module.body.map((q, i) => (
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
        </Col>
      </Row>
    </div>
  )
}

QuizBuilder.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape(),
  }).isRequired,
  module: PropTypes.shape().isRequired,
  addNotification: PropTypes.func.isRequired,
  handleBodyUpdate: PropTypes.func.isRequired,
  currentUser: PropTypes.shape(),
};

QuizBuilder.defaultProps = {
  currentUser: {},
};
