import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Joyride from 'react-joyride';
import Module from '../containers/Module';
import config from '../config';

const tutorialSteps = [
  {
    target: '.doc-title',
    content: 'This is a doc page',
    placement: 'top',
  },
  {
    target: '.doc-nav',
    content: 'This is the navigation bar. You can click the left and right arrows to move from one page to the next',
    placement: 'top',
  },
  {
    target: '.doc-current-page',
    content: 'This wil show you which page is currently in',
    placement: 'top',
  },
  {
    target: '.doc-nav-hint',
    content: 'You can also use the left and right arrow keys to change the pages',
    placement: 'top',
  },
  {
    target: '.restart-tutorial',
    content: 'Tutorial is finished. You can click here to start the tutorial again',
    placement: 'top',
  },
];

/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
class TutorialDoc extends Component {
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
            <h2>Step 5 of the tutorial</h2>
            <p>perhaps some content about the PDF viewer??</p>
            <Button color="primary" onClick={this.startTutorial}>Begin Tutorial</Button>
            <hr />
          </Col>
        </Row>
      </Container>
      <Module courseId={config.tutorial.course} moduleId={config.tutorial.doc} moduleType="doc" {...this.props} demoMode />
      <Container>
        <Row>
          <Col>
            <Button className="mr-2">Start Again</Button>
            <Button color="primary" tag={Link} to="/tutorials" className="restart-tutorial">Restart the tutorial</Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default TutorialDoc;
