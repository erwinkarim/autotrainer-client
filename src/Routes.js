import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import CoursePromo from "./containers/CoursePromo";
import CourseTOC from "./containers/CourseTOC";
import Article from "./containers/Article";
import Quiz from "./containers/Quiz";
import UserLanding from './containers/UserLanding';
import NotFound from "./containers/NotFound";

import CourseBuilder from './containers/CourseBuilder';
import ArticleBuilder from './containers/ArticleBuilder';
import QuizBuilder from './containers/QuizBuilder';


export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route path="/courses/promo" exact component={CoursePromo} />
    <Route path="/courses/toc" exact component={CourseTOC} />
    <Route path="/courses/article" exact component={Article} />
    <Route path="/courses/quiz" exact component={Quiz} />
    <Route path="/user/landing" exact component={UserLanding} />
    <Route path="/user/course_builder" exact component={CourseBuilder} />
    <Route path="/user/article_builder" exact component={ArticleBuilder} />
    <Route path="/user/quiz_builder" exact component={QuizBuilder} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
