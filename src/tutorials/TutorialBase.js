// Tutorial base component to be used for others (course promo,quiz, etc ...)

import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Joyride from 'react-joyride';
import { ACTIONS, EVENTS } from 'react-joyride/es/constants';
import PropTypes from 'prop-types';

const randomString = () => Math.random().toString(36).substring(7);
/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
export default class TutorialBase extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      run: false,
      stepIndex: 0,
      key: randomString(),
    };
  }
  startTutorial = () => {
    this.setState({ run: true });
  }
  restartTutorial = () => {
    this.setState({ key: randomString(), stepIndex: 0, run: true });
  }
  joyrideCallback = (tour) => {
    const { action, index, type } = tour;

    if (type === EVENTS.TOUR_END) {
      // Update user preferences with completed tour flag
      this.setState({ run: false });
      // this.setState({ run: false });
    } else if ([EVENTS.STEP_AFTER, EVENTS.CLOSE, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Sunce this is a controlled tour you'll need to update the state to advance the tour
      this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    }
  }
  render = () => {
    const {
      tutorialSteps, nextTutorial, component, step, title, openingStatement,
    } = this.props;

    const componentStyle = this.state.run ? null : {
      filter: 'blur(2px)',
      '-webkit-filter': 'blue(2px)',
      pointerEvents: 'none',
    };

    return (
      <div className="mb-2">
        <div key={this.state.key}>
          <Joyride
            ref={(jr) => { this.joyride = jr; }}
            autoStart
            continuous
            showProgress
            scrollToFirstStep
            steps={tutorialSteps}
            callback={this.joyrideCallback}
            stepIndex={this.state.stepIndex}
            run={this.state.run}
          />
        </div>
        <Container className="my-2">
          <Row>
            <Col>
              <h2>Step {step}: {title}</h2>
              <p>{openingStatement}</p>
              <Button color="primary" onClick={this.startTutorial}>Begin Tutorial</Button>
              <hr />
            </Col>
          </Row>
        </Container>
        <div style={componentStyle}>
          { component }
        </div>
        <Container>
          <Row>
            <Col>
              <Button className="mr-2" onClick={this.restartTutorial}>Start Again</Button>
              <Button color="primary" tag={Link} to={nextTutorial} className="next-tutorial">Continue ...</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

TutorialBase.propTypes = {
  tutorialSteps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  nextTutorial: PropTypes.string.isRequired,
  component: PropTypes.shape({}).isRequired,
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  openingStatement: PropTypes.string.isRequired,
};
