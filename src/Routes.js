import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NewCourse from './containers/NewCourse'
import CoursePromo from "./containers/CoursePromo";
import CourseTOC from "./containers/CourseTOC";
import Article from "./containers/Article";
import Quiz from "./containers/Quiz";
import UserLanding from './containers/UserLanding';
import Legal from './containers/Legal';
import Contact from './containers/Contact';
import Logout from './containers/Logout';
import NotFound from "./containers/NotFound";


import CourseBuilder from './containers/CourseBuilder';
import ArticleBuilder from './containers/ArticleBuilder';
import QuizBuilder from './containers/QuizBuilder';


export default ({childProps}) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />

    {/* system */}
    <AppliedRoute path="/login" exact component={Login} props={childProps}/>
    <Route path="/logout" exact component={Logout} />

    {/* public course page */}
    <AppliedRoute path="/courses/promo/:id" exact component={CoursePromo} props={childProps} />
    {/* course pages that is valid for people who enrolled */}
    <AppliedRoute path="/courses/toc/:id" exact component={CourseTOC} props={childProps} />
    <Route path="/courses/article" exact component={Article} />
    <Route path="/courses/quiz" exact component={Quiz} />

    {/* user pages */}
    <AppliedRoute path="/courses/new" exact component={NewCourse} props={childProps} />
    <AppliedRoute path="/user/landing" exact component={UserLanding} props={childProps} />
    <AppliedRoute path="/user/course_builder/:id" exact component={CourseBuilder} props={childProps} />
    <Route path="/user/article_builder" exact component={ArticleBuilder} />
    <Route path="/user/quiz_builder" exact component={QuizBuilder} />

    {/* misc pages */}
    <Route path="/legal" exact component={Legal} />
    <Route path="/contact" exact component={Contact} />

    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
