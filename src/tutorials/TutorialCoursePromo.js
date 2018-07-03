import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Joyride from 'react-joyride';
import PropTypes from 'prop-types';
import CoursePromo from '../containers/CoursePromo';
import config from '../config';

const tutorialSteps = [
  {
    target: '.course-promo-title',
    content: 'This is a course promotion page where you can view description and eventually enrol in the course',
    placement: 'bottom',
  },
  {
    target: '.course-promo-description',
    content: 'The course description will be here. Usually will give a brief overview of what the course is about',
    placement: 'bottom',
  },
  {
    target: '#course-enrol-button-1',
    content: 'Click here to enrol to a course. Take note of the pricing',
    placement: 'bottom',
  },
  {
    target: '.course-toc',
    content: 'This will show an overview of the topics that will be covered in the course',
    placement: 'bottom',
  },
  {
    target: '#course-enrol-button-2',
    content: 'You can also enrol into the course here',
    placement: 'bottom',
  },
  {
    target: '.next-tutorial',
    content: 'Conitnue to next tutorial when you are ready',
    placement: 'top',
  },
]
/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
class TutorialCoursePromo extends Component {
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
  render = props => (
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
            <h2>Step 2 of the tutorial</h2>
            <p>perhaps some content about a typical course page and how to enrol ??</p>
            <Button color="primary" onClick={this.startTutorial}>Begin Tutorial</Button>
            <hr />
          </Col>
        </Row>
      </Container>
      <CoursePromo courseId={config.tutorial.course} {...props} demoMode />
      <Container>
        <Row>
          <Col>
            <Button className="mr-2">Start Again</Button>
            <Button color="primary" tag={Link} to="/tutorials/course_toc" className="next-tutorial">Continue ...</Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default TutorialCoursePromo;
