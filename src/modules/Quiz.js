import React, { Component } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardText, Button, FormGroup, Label,
  Input, Nav, Navbar, NavItem,
} from 'reactstrap';
import Sticky from 'react-sticky-el';
import PropTypes from 'prop-types';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';


/**
 * The Constructor
 * @param {json} currentAnswers current state of answers
 * @param {json} e current state of answers
 * @returns {null} The sum of the two numbers.
 */
export default class Quiz extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      answers: [], checkAnswer: false,
    };
  }
  componentDidMount = async () => {
    // update current answers if available
    if (this.props.enrolment !== null) {
      if (this.props.enrolment.progress_detail === undefined) {
        return;
      }

      // check current progress and populate answers if possible
      const progressDetail = this.props.enrolment.progress_detail;
      const currentProgress =
        progressDetail.find(e => Object.keys(e)[0] === this.props.module.moduleId);
      if (currentProgress) {
        try {
          const currentAnswers =
            JSON.parse(currentProgress[this.props.module.moduleId]).current_answers;
          // console.log('currentAnswers', currentAnswers);
          this.setState({ answers: currentAnswers });

          // if progress is complete, but attendance hasn't been record, mark attendance
          this.attendanceCheck(currentAnswers);
        } catch (e) {
          console.log('error parsing JSON');
        }
      }
    }
  }
  attendanceCheck = (currentAnswers) => {
    // check if current answers length matches questions and if attendance
    // is not yet recorded, mark attendance
    if (currentAnswers.length === this.props.module.body.length &&
      !this.props.enrolment.progress.includes(this.props.module.moduleId)) {
      // mark attendance
      this.props.triggerAttendance();
    }
  }
  recordAnswer = async (e) => {
    console.log('should record answer');
    const newAnswer = this.state.answers;
    newAnswer[parseInt(e.target.dataset.qindex, 10)] = parseInt(e.target.dataset.aindex, 10);
    this.setState({ answers: newAnswer });
    // record attendance when all question are answered
    this.attendanceCheck(newAnswer);

    // update answer to the db
    try {
      await this.notifyProgressDetail();
    } catch (err) {
      console.log('error updating enrolment progress detail');
      console.log('ignore this if you own this course');
      console.log(err);
    }
  }
  notifyProgressDetail = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    method: 'POST',
    path: `/enrolment/${this.props.module.courseId}/mark_progress/${this.props.module.moduleId}`,
    body: {
      current_answers: this.state.answers,
    },
  })
  checkAnswer = () => {
    this.setState({ checkAnswer: true });
  }
  /*
    TODO: stop render new things everytime you cilck something
  */
  render = () => {
    const answeredQ = this.state.answers.reduce((a, v) => {
      const newA = a + (v !== undefined ? 1 : 0); return newA;
    }, 0);
    const correctAnswer =
      this.state.answers.reduce((a, v, i) => {
        const newA = a + (v === this.props.module.body[i].answer_key ? 1 : 0); return newA;
      }, 0);

    let answeredQBlock = (
      <span>Answered {correctAnswer} of {this.props.module.body.length} correctly.</span>
    );
    if (this.props.module.body.length !== answeredQ) {
      answeredQBlock = (
        <span>
          Answered {answeredQ} of {this.props.module.body.length} questions.
        </span>
      );
    } else if (!this.state.checkAnswer) {
      answeredQBlock = (<span>Answered all questions! <Button color="primary" outline size="sm" onClick={this.checkAnswer}>Check?</Button></span>);
    }

    return (
      <Container className="mt-2 text-left">
        <Row>
          <Col xs="12" md="8">
            {
            this.props.module.body.map((q, i) => {
              const answerCorrectly = this.state.checkAnswer ?
                this.props.module.body[i].answer_key === this.state.answers[i]
               : null;
              let borderColor = null;
              if (answerCorrectly !== null) {
                borderColor = (answerCorrectly ? 'border border-success' : 'border border-danger');
              }
              return (
                <Card key={parseInt(Math.random() * 1000, 10)} className={`mb-3 ${borderColor}`}>
                  <CardBody>
                    <CardText>Question {i + 1}:</CardText>
                    <CardText className="lead">{ q.question}</CardText>
                    {
                      q.answers.map((a, i2) => {
                        let checkedAnswerText = null;
                        if (this.state.checkAnswer) {
                          checkedAnswerText = this.props.module.body[i].answer_key === i2 ? <span className="text-success"> - Correct answer</span> : null;
                        }
                        return (
                          <FormGroup check key={parseInt(Math.random() * 1000, 10)}>
                            <Label check disabled={this.state.checkAnswer}>
                              <Input
                                type="radio"
                                name={`q${i + 1}-answer[]`}
                                data-qindex={i}
                                data-aindex={i2}
                                onChange={this.recordAnswer}
                                checked={this.state.answers[i] === i2}
                                disabled={this.state.checkAnswer}
                              />
                              { a }
                              { checkedAnswerText }
                            </Label>
                          </FormGroup>
                        );
                      })
                    }
                  </CardBody>
                </Card>
              );
            })
          }
          </Col>
          <Col xs="12" md="8" className="mb-3">
            <Sticky style={{ zIndex: 100 }} mode="bottom">
              <Navbar color="light" dark className="mb-2 border border-info">
                <Nav navbar>
                  <NavItem>{ answeredQBlock }</NavItem>
                </Nav>
              </Navbar>
            </Sticky>
          </Col>
        </Row>
      </Container>
    );
  }
}

Quiz.propTypes = {
  enrolment: PropTypes.shape({
    progress_detail: PropTypes.arrayOf(PropTypes.shape()),
    progress: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  module: PropTypes.shape().isRequired,
  triggerAttendance: PropTypes.func.isRequired,
};

Quiz.defaultProps = {};
