import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Joyride from 'react-joyride';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import UserLanding from '../containers/UserLanding';

const tutorialSteps = [
  {
    target: '.user-landing-welcome',
    content: 'This is your landing page. The first page after you logged in',
    disableBeacon: true,
    placement: 'center',
  },
  {
    target: '.user-landing',
    content: 'You can access this page anytime by clicking  "You" in the navigation bar',
    placement: 'bottom',
  },
  {
    target: '.enrolled-courses-main-title',
    content: 'This is your enrolled courses!',
    placement: 'bottom',
    placementBeacon: 'left',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '.enrolled-courses-title',
    content: 'Click here to view the course',
    placement: 'right',
  },
  {
    target: '.enrolled-courses-cert',
    content: 'Click here to view the completition certificate',
    placement: 'right',
  },
  {
    target: '.invited-courses-card-demo',
    content: 'If you are invited to a course, it will show up here',
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
class TutorialUserLanding extends Component {
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
    this.setState({ run: true });
  }
  joyrideCallBack = (data) => {
  }
  render = () => {
    const { run } = this.state;

    return (
      <Container className="my-2">
        <Helmet>
          <title>User landing tutorial</title>
        </Helmet>
        <Joyride
          ref={(jr) => { this.joyride = jr; }}
          continuous
          showProgress
          scrollToFirstStep
          steps={tutorialSteps}
          run={run}
        />
        <Row>
          <Col>
            <h2>Step 1 of the tutorial</h2>
            <p>perhaps some content about your landing page ??</p>
            <Button color="primary" onClick={this.startTutorial}>Begin Tutorial</Button>
            <hr />
          </Col>
        </Row>
        <Row>
          <UserLanding {...this.props} demoMode />
        </Row>
        <Row>
          <Col>
            <Button onClick={() => { alert('working on it'); }} className="mr-2">Restart Tutorial</Button>
            <Button color="primary" className="next-tutorial" tag={Link} to="/tutorials/course_promo">Continue ...</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

TutorialUserLanding.propTypes = {
  joyride: PropTypes.shape({
    callback: PropTypes.func
  }),
};

TutorialUserLanding.defaultProps = {
  joyride: {},
};

export default TutorialUserLanding;
