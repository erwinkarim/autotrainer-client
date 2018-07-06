import React from 'react';
import TutorialBase from './TutorialBase';
import Module from '../containers/Module';
import config from '../config';

const tutorialSteps = [
  {
    target: '.doc-title',
    content: 'This is a doc page',
    placement: 'top',
    disableBeacon: true,
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

const TutorialDoc = props => (
  <TutorialBase
    tutorialSteps={tutorialSteps}
    nextTutorial="/tutorials"
    component={<Module courseId={config.tutorial.course} moduleId={config.tutorial.doc} moduleType="doc" {...props} demoMode />}
    step={5}
    openingStatement="Tutorial about course TOC"
  />
)

export default TutorialDoc;
