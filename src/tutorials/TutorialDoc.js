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

const desc = `Some of the modules are in pdf form and presented using our display system.
  This tutorial will show you how to navigate through the document and some shortcuts to
  help you read the documents better.`;

const TutorialDoc = props => (
  <TutorialBase
    tutorialSteps={tutorialSteps}
    nextTutorial="/tutorials"
    component={<Module courseId={config.tutorial.course} moduleId={config.tutorial.doc} moduleType="doc" {...props} demoMode />}
    title="Document Viewer Tutorial"
    step={5}
    openingStatement={desc}
  />
)

export default TutorialDoc;
