import React from 'react';
import Courses from '../containers/Courses';
import TutorialBase from './TutorialBase';

const tutorialSteps = [
  {
    target: '.courses-title',
    content: 'This is a course promotion page where you can view description and eventually enrol in the course',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.courses-nav',
    content: 'You can visit this page anytime by clicking here',
    placement: 'bottom',
  },
  {
    target: '.course-demo-card',
    content: 'Each card represent a course',
    placement: 'right',
  },
  {
    target: '.course-card-title',
    content: 'You can view each of the courses by clicking on the title ...',
    placement: 'right',
  },
  {
    target: '.course-card-footer',
    content: '... or clicking on the `Learn More` button. This button will change when you enrolled in the course',
    placement: 'right',
  },
  {
    target: '.next-tutorial',
    content: 'Conitnue to next tutorial when you are ready',
    placement: 'top',
  },
];
const desc = `The courses page lists out all the courses in learn@AP. You can
  explore courses here and start enrol in you interested courses here.`;

const TutorialCourses = props => (
  <TutorialBase
    tutorialSteps={tutorialSteps}
    nextTutorial="/tutorials/course_promo"
    component={<Courses {...props} demoMode />}
    step={2}
    title="Courses Page"
    openingStatement={desc}
  />
);

export default TutorialCourses;
