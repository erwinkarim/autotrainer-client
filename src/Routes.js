import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppliedRoute from './components/AppliedRoute';
import asyncComponent from './components/AsyncComponent';
import CourseTest from './components/CourseTest';

const AsyncHome = asyncComponent(() => import('./containers/Home'));
const AsyncLogin = asyncComponent(() => import('./containers/Login'));
const AsyncNewCourse = asyncComponent(() => import('./containers/NewCourse'));
const AsyncCourses = asyncComponent(() => import('./containers/Courses'));
const AsyncCoursePromo = asyncComponent(() => import('./containers/CoursePromo'));
const AsyncCoursePurchase = asyncComponent(() => import('./containers/Purchase'));

const AsyncModule = asyncComponent(() => import('./containers/Module'));

const AsyncUserLanding = asyncComponent(() => import('./containers/UserLanding'));
const AsyncLegal = asyncComponent(() => import('./containers/Legal'));
const AsyncContact = asyncComponent(() => import('./containers/Contact'));
const AsyncLogout = asyncComponent(() => import('./containers/Logout'));
const AsyncNotFound = asyncComponent(() => import('./containers/NotFound'));
const AsyncTestFn = asyncComponent(() => import('./containers/TestFn'));
const AsyncCertCheck = asyncComponent(() => import('./containers/CertCheck'));
const AsyncAbout = asyncComponent(() => import('./containers/About'));
const AsyncTeam = asyncComponent(() => import('./containers/Team'));

const AsyncBuilder = asyncComponent(() => import('./containers/Builder'));
const AsyncArticleBuilder = asyncComponent(() => import('./modules/ArticleBuilder'));
const AsyncQuizBuilder = asyncComponent(() => import('./modules/QuizBuilder'));
const AsyncDocBuilder = asyncComponent(() => import('./modules/DocBuilder'));
const AsyncVideoBuilder = asyncComponent(() => import('./modules/VideoBuilder'));

const AsyncTutorial = asyncComponent(() => import('./tutorials/Tutorial'));
const AsyncTutorialUL = asyncComponent(() => import('./tutorials/TutorialUserLanding'));
const AsyncTutorialCourses = asyncComponent(() => import('./tutorials/TutorialCourses'));
const AsyncTutorialCoursePromo = asyncComponent(() => import('./tutorials/TutorialCoursePromo'));
const AsyncTutorialCourseTOC = asyncComponent(() => import('./tutorials/TutorialCourseTOC'));
const AsyncTutorialQuiz = asyncComponent(() => import('./tutorials/TutorialQuiz'));
const AsyncTutorialDoc = asyncComponent(() => import('./tutorials/TutorialDoc'));

const Routes = ({ childProps }) =>
  (
    <Switch>
      <AppliedRoute path="/" exact component={AsyncHome} props={childProps} />

      {/* system */}
      <AppliedRoute path="/login" exact component={AsyncLogin} props={childProps} />
      <Route path="/logout" exact component={AsyncLogout} />

      {/* public course page */}
      <AppliedRoute path="/courses" exact component={AsyncCourses} props={childProps} />
      <AppliedRoute path="/courses/promo/:id" exact component={AsyncCoursePromo} props={childProps} />
      {/* course pages that is valid for people who enrolled */}
      <AppliedRoute path="/courses/:moduleType/:courseId" exact component={AsyncModule} props={childProps} />
      <AppliedRoute path="/courses/:moduleType/:courseId/:moduleId" exact component={AsyncModule} props={childProps} />
      {
        process.env.NODE_ENV === 'development' ?
          <AppliedRoute path="/courses/purchase" exact component={AsyncCoursePurchase} props={childProps} />
          : null
      }

      {/* user pages */}
      <AppliedRoute path="/courses/new" exact component={AsyncNewCourse} props={childProps} />
      <AppliedRoute path="/welcome" exact component={AsyncUserLanding} props={childProps} />
      <AppliedRoute path="/user/builder/:courseId" exact component={AsyncBuilder} props={{ ...childProps, ...{ courseMode: true } }} />
      <AppliedRoute path="/user/builder/:courseId/:moduleId" exact component={AsyncBuilder} props={childProps} />
      <AppliedRoute path="/user/article_builder/:courseId/:moduleId" exact component={AsyncArticleBuilder} props={childProps} />
      <AppliedRoute path="/user/quiz_builder/:courseId/:moduleId" exact component={AsyncQuizBuilder} props={childProps} />
      <AppliedRoute path="/user/doc_builder/:courseId/:moduleId" exact component={AsyncDocBuilder} props={childProps} />
      <AppliedRoute path="/user/video_builder/:courseId/:moduleId" exact component={AsyncVideoBuilder} props={childProps} />

      {/* tutorial pages */}
      <AppliedRoute path="/tutorials" exact component={AsyncTutorial} props={childProps} />
      <AppliedRoute path="/tutorials/user_landing" exact component={AsyncTutorialUL} props={childProps} />
      <AppliedRoute path="/tutorials/courses" exact component={AsyncTutorialCourses} props={childProps} />
      <AppliedRoute path="/tutorials/course_promo" exact component={AsyncTutorialCoursePromo} props={childProps} />
      <AppliedRoute path="/tutorials/course_toc" exact component={AsyncTutorialCourseTOC} props={childProps} />
      <AppliedRoute path="/tutorials/quiz" exact component={AsyncTutorialQuiz} props={childProps} />
      <AppliedRoute path="/tutorials/doc" exact component={AsyncTutorialDoc} props={childProps} />

      {/* misc pages */}
      <Route path="/legal" exact component={AsyncLegal} />
      <AppliedRoute path="/contact" exact component={AsyncContact} props={childProps} />
      <AppliedRoute path="/verify_cert" exact component={AsyncCertCheck} props={childProps} />
      <AppliedRoute path="/about" exact component={AsyncAbout} props={childProps} />
      <AppliedRoute path="/team" exact component={AsyncTeam} props={childProps} />
      { process.env.NODE_ENV === 'development' ? <AppliedRoute path="/test" exact component={AsyncTestFn} props={childProps} /> : null}
      { process.env.NODE_ENV === 'development' ? <Route path="/courses/test" exact component={CourseTest} props={childProps} /> : null }

      { /* Finally, catch all unmatched routes */ }
      <Route component={AsyncNotFound} />
    </Switch>
  );

export default Routes;

Routes.propTypes = {
  childProps: PropTypes.shape({}).isRequired,
};
