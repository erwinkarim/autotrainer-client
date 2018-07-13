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
    target: '.enrolled-courses',
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
    target: '.enrolled-demo-card',
    content: 'Each card represents an enrolled course',
    placement: 'right',
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
    target: '.courses-button',
    content: 'Click here to explore learn@AP courses',
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

const desc = `The welcome page is the first page that you will visit when you log on
  to learn@AP. It contains an overview on the courses that you are currently enrolled
  and also courses that you are invited.`;

const TutorialUserLanding = props => (
  <TutorialBase
    tutorialSteps={tutorialSteps}
    nextTutorial="/tutorials/courses"
    component={<UserLanding demoMode {...props} />}
    step={1}
    title="Welcome Page"
    openingStatement={desc}
  />
);

export default TutorialUserLanding;
