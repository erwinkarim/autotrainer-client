import React from 'react';
import TutorialBase from './TutorialBase';
import Module from '../containers/Module';
import config from '../config';

const tutorialSteps = [
  {
    target: '.quiz-body',
    content: 'This is a quiz page',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '.quiz-card',
    content: 'You answer the question by clicking on one of the answers',
    placement: 'right',
  },
  {
    target: '.quiz-progress',
    content: 'This is the status bar for the quiz. As you progress answering question, this status bar will update your progress',
    placement: 'bottom',
  },
  {
    target: '.quiz-progress',
    content: 'There will be an option to check your answers when you have completed the quiz',
    placement: 'bottom',
  },
  {
    target: '.next-tutorial',
    content: 'Conitnue to next tutorial when you are ready',
    placement: 'top',
  },
];

const desc = `One of the modules in a course is the quiz module. This tutorial will show how
  to go through the quiz module, check your answers and save your answers.`;
const TutorialQuiz = props => (
  <TutorialBase
    tutorialSteps={tutorialSteps}
    nextTutorial="/tutorials/doc"
    component={<Module courseId={config.tutorial.course} moduleId={config.tutorial.quiz} moduleType="quiz" {...props} demoMode />}
    step={5}
    title="Quiz Example"
    openingStatement={desc}
  />
);

export default TutorialQuiz;
