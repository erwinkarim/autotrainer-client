import React from 'react';
import Module from '../containers/Module';
import config from '../config';
import TutorialBase from './TutorialBase';

const tutorialSteps = [
  {
    target: '.course-toc-title',
    content: 'When you enroled in a course, this is the first page that you will see',
    placement: 'bottom',
    disableBeacon: true,
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

const desc = `Once you have enrolled in the course, you will gain access to the main
  course page. Each course is divided into modules to cover a topic in the course.
  You will receive an attendance certificate once you have complete your course.`;

const TutorialCourseTOC = props => (
  <TutorialBase
    tutorialSteps={tutorialSteps}
    nextTutorial="/tutorials/quiz"
    component={<Module courseId={config.tutorial.course} moduleType="toc" {...props} demoMode />}
    step={4}
    title="Course Main Page"
    openingStatement={desc}
  />
);

export default TutorialCourseTOC;
