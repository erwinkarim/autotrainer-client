import React, { Component } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardText, Button, FormGroup, Label,
  Input, Nav, Navbar, NavItem,
} from 'reactstrap';
import Helmet from 'react-helmet';
import Sticky from 'react-sticky-el';
import PropTypes from 'prop-types';
import Notice from '../components/Notice';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';
import CourseMenu from '../components/CourseMenu';


/**
 * The Constructor
 * @param {json} e the props
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
      quiz: null, answers: [], checkAnswer: false, enrolment: null, loading: true,
    };
  }
  componentDidMount = async () => {
    const handle = this;
    try {
      console.log('attemp to load quiz');
      const result = await this.loadQuiz();
      handle.setState({
        quiz: result,
        answers: Array.from(Array(result.body.length)),
        checkAnswer: false,
        loading: false,
      });
    } catch (e) {
      console.log('error getting quiz');
      console.log(e);
    }

    // load enrolment
    try {
      const result = await this.loadEnrolment();
      this.setState({ enrolment: result });
    } catch (e) {
      console.log('error getting enrolment');
      console.log('ignore this if you own this course');
      console.log(e);
    }

    // update current answers if available
    if (this.state.enrolment !== null) {
      if (this.state.enrolment.progress_detail === undefined) {
        return;
      }

      const progressDetail = this.state.enrolment.progress_detail;
      const currentProgress =
        progressDetail.find(e => Object.keys(e)[0] === this.state.quiz.moduleId);
      if (currentProgress) {
        try {
          const currentAnswers =
            JSON.parse(currentProgress[this.state.quiz.moduleId]).current_answers;
          this.setState({ answers: currentAnswers });
        } catch (e) {
          console.log('error parsing JSON');
        }
      }
    }
  }
  loadQuiz = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: `/modules/${this.props.match.params.moduleId}`,
    queryParams: { courseId: this.props.match.params.courseId },
  })
  loadEnrolment = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    path: `/enrolment/${this.state.quiz.courseId}`,
  })
  recordAnswer = async (e) => {
    console.log('should record answer');
    const newAnswer = this.state.answers;
    newAnswer[parseInt(e.target.dataset.qindex, 10)] = parseInt(e.target.dataset.aindex, 10);
    this.setState({ answers: newAnswer });
    // record attendance when all question are answered
    if (
      newAnswer.reduce((a, v) => {
        const newA = a + v !== undefined ? 1 : 0; return newA;
      }, 0) === this.state.quiz.body.length
    ) {
      this.triggerComplete();
    }

    // update answer to the db
    try {
      await this.notifyProgressDetail();
    } catch (err) {
      console.log('error updating enrolment progress detail');
      console.log('ignore this if you own this course');
      console.log(err);
    }
  }
  triggerComplete = async () => {
    if (this.state.enrolment !== null) {
      try {
        if (!this.state.enrolment.progress.includes(this.state.quiz.moduleId)) {
          // notify attendance
          let result = await this.notifyProgress();

          // should notify if course completed
          if (result.status === 0) {
            this.props.addNotification('Course complete. View your certificate at the landing page');
          }

          // update enrolment progress
          result = await this.loadEnrolment();
          this.setState({ enrolment: result });

          this.props.addNotification('We remark that you have completed this quiz');
        }
      } catch (e) {
        console.log('error notifying progress');
        console.log(e);
      }
    }
  }
  notifyProgress = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    method: 'POST',
    path: `/enrolment/${this.state.quiz.courseId}/attend/${this.state.quiz.moduleId}`,
    body: {},
  })
  notifyProgressDetail = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    method: 'POST',
    path: `/enrolment/${this.state.quiz.courseId}/mark_progress/${this.state.quiz.moduleId}`,
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
    if (this.state.loading) {
      return <Notice content="Quiz is loading ..." />;
    }

    if (this.props.currentUser === null) {
      return (<Notice content="Not logged in" />);
    }

    if (this.state.quiz === null) {
      return (<Notice content="Quiz not loaded" />);
    }

    const answeredQ = this.state.answers.reduce((a, v) => {
      const newA = a + (v !== undefined ? 1 : 0); return newA;
    }, 0);
    const correctAnswer =
      this.state.answers.reduce((a, v, i) => {
        const newA = a + (v === this.state.quiz.body[i].answer_key ? 1 : 0); return newA;
      }, 0);

    let answeredQBlock = (
      <span>Answered {correctAnswer} of {this.state.quiz.body.length} correctly.</span>
    );
    if (this.state.quiz.body.length !== answeredQ) {
      answeredQBlock = (
        <span>
          Answered {answeredQ} of {this.state.quiz.body.length} questions.
        </span>
      );
    } else if (!this.state.checkAnswer) {
      answeredQBlock = (<span>Answered all questions! <Button color="primary" outline size="sm" onClick={this.checkAnswer}>Check?</Button></span>);
    }

    return (
      <Container className="mt-2 text-left">
        <Helmet>
          <title>{this.state.quiz.title} - {config.site_name}</title>
        </Helmet>
        <Row>
          <Col>
            <CourseMenu courseId={this.state.quiz.courseId} moduleId={this.state.quiz.moduleId} />
          </Col>
        </Row>
        <Row>
          <div className="col-12 col-md-8 mb-3">
            <Sticky style={{ zIndex: 100 }}>
              <Navbar color="light" dark>
                <Nav navbar>
                  <NavItem>{ answeredQBlock }</NavItem>
                </Nav>
              </Navbar>
            </Sticky>
          </div>
          <div className="col-12 col-md-8">
            {
            this.state.quiz.body.map((q, i) => {
              const answerCorrectly = this.state.checkAnswer ?
                this.state.quiz.body[i].answer_key === this.state.answers[i]
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
                          checkedAnswerText = this.state.quiz.body[i].answer_key === i2 ? <span className="text-success"> - Correct answer</span> : null;
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
          </div>
        </Row>
      </Container>
    );
  }
}

Quiz.propTypes = {
  match: PropTypes.shape().isRequired,
  addNotification: PropTypes.func.isRequired,
  currentUser: PropTypes.shape(),
};

Quiz.defaultProps = {
  currentUser: {},
};
