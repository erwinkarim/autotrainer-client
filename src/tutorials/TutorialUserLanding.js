import React from 'react';
import UserLanding from '../containers/UserLanding';
import TutorialBase from './TutorialBase';

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

const TutorialUserLanding = props => (
  <TutorialBase
    tutorialSteps={tutorialSteps}
    nextTutorial="/tutorials/course_toc"
    component={<UserLanding demoMode {...props} />}
    step={1}
    openingStatement="Talk about welcome page. The first page that you see."
  />
);

export default TutorialUserLanding;
