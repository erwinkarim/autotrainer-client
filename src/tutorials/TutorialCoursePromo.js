import React from 'react';
import CoursePromo from '../containers/CoursePromo';
import config from '../config';
import TutorialBase from './TutorialBase';

const tutorialSteps = [
  {
    target: '.course-promo-title',
    content: 'This is a course promotion page where you can view description and eventually enrol in the course',
    placement: 'bottom',
    disableBeacon: true,
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
];


const TutorialCoursePromo = props => (
  <TutorialBase
    tutorialSteps={tutorialSteps}
    nextTutorial="/tutorials/course_toc"
    component={<CoursePromo courseId={config.tutorial.course} {...props} demoMode />}
    step={2}
    openingStatement="perhaps some content about a typical course page and how to enrol ??"
  />
);

export default TutorialCoursePromo;
