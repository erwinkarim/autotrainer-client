import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NewCourse from './containers/NewCourse';
import Courses from './containers/Courses';
import CoursePromo from "./containers/CoursePromo";
import CourseTOC from "./containers/CourseTOC";

import Article from "./containers/Article";
import Quiz from "./containers/Quiz";
import DocViewer from './modules/DocViewer';
import Video from './modules/Video';

import UserLanding from './containers/UserLanding';
import Legal from './containers/Legal';
import Contact from './containers/Contact';
import Logout from './containers/Logout';
import NotFound from "./containers/NotFound";
import TestFn from './containers/TestFn';


import CourseBuilder from './containers/CourseBuilder';
import ArticleBuilder from './containers/ArticleBuilder';
import QuizBuilder from './containers/QuizBuilder';
import DocBuilder from './modules/DocBuilder';
import VideoBuilder from './modules/VideoBuilder';


export default ({childProps}) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />

    {/* system */}
    <AppliedRoute path="/login" exact component={Login} props={childProps}/>
    <Route path="/logout" exact component={Logout} />

    {/* public course page */}
    <AppliedRoute path="/courses" exact component={Courses} props={childProps} />
    <AppliedRoute path="/courses/promo/:id" exact component={CoursePromo} props={childProps} />
    {/* course pages that is valid for people who enrolled */}
    <AppliedRoute path="/courses/toc/:id" exact component={CourseTOC} props={childProps} />
    <AppliedRoute path="/courses/article/:courseId/:articleId" exact component={Article} props={childProps} />
    <AppliedRoute path="/courses/quiz/:courseId/:moduleId" exact component={Quiz} props={childProps} />
    <AppliedRoute path="/courses/doc/:courseId/:moduleId" exact component={DocViewer} props={childProps} />
    <AppliedRoute path="/courses/video/:courseId/:moduleId" exact component={Video} props={childProps} />

    {/* user pages */}
    <AppliedRoute path="/courses/new" exact component={NewCourse} props={childProps} />
    <AppliedRoute path="/welcome" exact component={UserLanding} props={childProps} />
    <AppliedRoute path="/user/course_builder/:id" exact component={CourseBuilder} props={childProps} />
    <AppliedRoute path="/user/article_builder/:courseId/:moduleId" exact component={ArticleBuilder} props={childProps} />
    <AppliedRoute path="/user/quiz_builder/:courseId/:moduleId" exact component={QuizBuilder} props={childProps} />
    <AppliedRoute path="/user/doc_builder/:courseId/:moduleId" exact component={DocBuilder} props={childProps} />
    <AppliedRoute path="/user/video_builder/:courseId/:moduleId" exact component={VideoBuilder} props={childProps} />

    {/* misc pages */}
    <Route path="/legal" exact component={Legal} />
    <AppliedRoute path="/contact" exact component={Contact} props={childProps} />
    <AppliedRoute path="/test" exact component={TestFn} props={childProps} />

    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
