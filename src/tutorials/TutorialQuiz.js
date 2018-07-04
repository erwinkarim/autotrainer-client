import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Joyride from 'react-joyride';
import Module from '../containers/Module';
import config from '../config';

const tutorialSteps = [
  {
    target: '.quiz-body',
    content: 'This is a quiz page',
    placement: 'top',
  },
  {
    target: '.quiz-card',
    content: 'You answer the question by clicking on one of the answers',
    placement: 'right',
  },
  {
    target: '.quiz-progress',
    content: 'This is the status bar for the quiz. As you progress answering question, this status bar will update your progress',
    placement: 'bottom',
  },
  {
    target: '.quiz-progress',
    content: 'There will be an option to check your answers when you have completed the quiz',
    placement: 'bottom',
  },
  {
    target: '.next-tutorial',
    content: 'Conitnue to next tutorial when you are ready',
    placement: 'top',
  },
];

/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
class TutorialQuiz extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);

    this.state = {
      run: false,
    };
  }
  startTutorial = () => {
    console.log('will start tutorial');
    this.setState({ run: true });
  }
  render = () => (
    <div>
      <Joyride
        ref={(jr) => { this.joyride = jr; }}
        continuous
        showProgress
        scrollToFirstStep
        steps={tutorialSteps}
        run={this.state.run}
      />
      <Container className="my-2">
        <Row>
          <Col>
            <h2>Step 4 of the tutorial</h2>
            <p>perhaps some content about quiz page ??</p>
            <Button color="primary" onClick={this.startTutorial}>Begin Tutorial</Button>
            <hr />
          </Col>
        </Row>
      </Container>
      <Module courseId={config.tutorial.course} moduleId={config.tutorial.quiz} moduleType="quiz" {...this.props} demoMode />
      <Container>
        <Row>
          <Col>
            <Button className="mr-2">Start Again</Button>
            <Button className="next-tutorial" color="primary" tag={Link} to="/tutorials/doc">Continue ...</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TutorialQuiz;
