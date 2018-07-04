import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Joyride from 'react-joyride';
import Module from '../containers/Module';
import config from '../config';

const tutorialSteps = [
  {
    target: '.course-toc-title',
    content: 'When you enroled in a course, this is the first page that you will see',
    placement: 'bottom',
  },
  {
    target: '.course-menu-hamburger',
    content: 'Use the menu bar to quickly go from one chapter to another',
    placement: 'bottom',
  },
  {
    target: '.course-toc',
    content: 'You can also view the table of contents here',
    placement: 'bottom',
  },
  {
    target: '.course-bottom-nav',
    content: 'Use the bottom navigation bar to go to the next module in the course',
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
class TutorialCourseTOC extends Component {
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
            <h2>Step 3 of the tutorial</h2>
            <p>perhaps some content about a typical course TOC page ??</p>
            <Button color="primary" onClick={this.startTutorial}>Begin Tutorial</Button>
            <hr />
          </Col>
        </Row>
      </Container>
      <Module courseId={config.tutorial.course} moduleType="toc" {...this.props} demoMode />
      <Container>
        <Row>
          <Col>
            <Button className="mr-2">Start Again</Button>
            <Button color="primary" tag={Link} to="/tutorials/quiz" className="next-tutorial">Continue ...</Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default TutorialCourseTOC;
