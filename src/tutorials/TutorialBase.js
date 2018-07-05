// Tutorial base component to be used for others (course promo,quiz, etc ...)

import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Joyride from 'react-joyride';
import PropTypes from 'prop-types';

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
    };
  }
  startTutorial = () => {
    console.log('will start tutorial');
    this.setState({ run: true });
  }
  render = () => {
    const {
      tutorialSteps, nextTutorial, component, step, openingStatement,
    } = this.props;

    return (
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
              <h2>Step {step} of the tutorial</h2>
              <p>{openingStatement}</p>
              <Button color="primary" onClick={this.startTutorial}>Begin Tutorial</Button>
              <hr />
            </Col>
          </Row>
        </Container>
        { component }
        <Container>
          <Row>
            <Col>
              <Button className="mr-2">Start Again</Button>
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
  openingStatement: PropTypes.string.isRequired,
};
