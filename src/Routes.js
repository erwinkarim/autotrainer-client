import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import asyncComponent from "./components/AsyncComponent";

const AsyncHome = asyncComponent(() => import("./containers/Home"));
const AsyncLogin = asyncComponent(() => import("./containers/Login"));
const AsyncNewCourse = asyncComponent(() => import("./containers/NewCourse"));
const AsyncCourses = asyncComponent(() => import("./containers/Courses"));
const AsyncCoursePromo = asyncComponent(() => import("./containers/CoursePromo"));
const AsyncCourseTOC = asyncComponent(() => import("./containers/CourseTOC"));

const AsyncArticle = asyncComponent(() => import("./containers/Article"));
const AsyncQuiz = asyncComponent(() => import("./containers/Quiz"));
const AsyncDocViewer = asyncComponent(() => import("./modules/DocViewer"));
const AsyncVideo = asyncComponent(() => import("./modules/Video"));

const AsyncUserLanding = asyncComponent(() => import("./containers/UserLanding"));
const AsyncLegal = asyncComponent(() => import("./containers/Legal"));
const AsyncContact = asyncComponent(() => import("./containers/Contact"));
const AsyncLogout = asyncComponent(() => import("./containers/Logout"));
const AsyncNotFound = asyncComponent(() => import("./containers/NotFound"));
const AsyncTestFn = asyncComponent(() => import("./containers/TestFn"));
const AsyncCertCheck = asyncComponent(() => import("./containers/CertCheck"));

const AsyncCourseBuilder = asyncComponent(() => import("./containers/CourseBuilder"));
const AsyncArticleBuilder = asyncComponent(() => import("./containers/ArticleBuilder"));
const AsyncQuizBuilder = asyncComponent(() => import("./containers/QuizBuilder"));
const AsyncDocBuilder = asyncComponent(() => import("./modules/DocBuilder"));
const AsyncVideoBuilder = asyncComponent(() => import("./modules/VideoBuilder"));


export default ({childProps}) =>
  <Switch>
    <AppliedRoute path="/" exact component={AsyncHome} props={childProps} />

    {/* system */}
    <AppliedRoute path="/login" exact component={AsyncLogin} props={childProps}/>
    <Route path="/logout" exact component={AsyncLogout} />

    {/* public course page */}
    <AppliedRoute path="/courses" exact component={AsyncCourses} props={childProps} />
    <AppliedRoute path="/courses/promo/:id" exact component={AsyncCoursePromo} props={childProps} />
    {/* course pages that is valid for people who enrolled */}
    <AppliedRoute path="/courses/toc/:id" exact component={AsyncCourseTOC} props={childProps} />
    <AppliedRoute path="/courses/article/:courseId/:articleId" exact component={AsyncArticle} props={childProps} />
    <AppliedRoute path="/courses/quiz/:courseId/:moduleId" exact component={AsyncQuiz} props={childProps} />
    <AppliedRoute path="/courses/doc/:courseId/:moduleId" exact component={AsyncDocViewer} props={childProps} />
    <AppliedRoute path="/courses/video/:courseId/:moduleId" exact component={AsyncVideo} props={childProps} />

    {/* user pages */}
    <AppliedRoute path="/courses/new" exact component={AsyncNewCourse} props={childProps} />
    <AppliedRoute path="/welcome" exact component={AsyncUserLanding} props={childProps} />
    <AppliedRoute path="/user/course_builder/:id" exact component={AsyncCourseBuilder} props={childProps} />
    <AppliedRoute path="/user/article_builder/:courseId/:moduleId" exact component={AsyncArticleBuilder} props={childProps} />
    <AppliedRoute path="/user/quiz_builder/:courseId/:moduleId" exact component={AsyncQuizBuilder} props={childProps} />
    <AppliedRoute path="/user/doc_builder/:courseId/:moduleId" exact component={AsyncDocBuilder} props={childProps} />
    <AppliedRoute path="/user/video_builder/:courseId/:moduleId" exact component={AsyncVideoBuilder} props={childProps} />

    {/* misc pages */}
    <Route path="/legal" exact component={AsyncLegal} />
    <AppliedRoute path="/contact" exact component={AsyncContact} props={childProps} />
    <AppliedRoute path="/cert_check" exact component={AsyncCertCheck} props={childProps} />
    <AppliedRoute path="/test" exact component={AsyncTestFn} props={childProps} />

    { /* Finally, catch all unmatched routes */ }
    <Route component={AsyncNotFound} />
  </Switch>;
