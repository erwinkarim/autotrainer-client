import React, { Component } from "react";
import { Container, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import {CardColumns, Card, CardTitle, CardBody, CardText, Button} from 'reactstrap';
import Notice from '../components/Notice';
import { HashLink as Link } from "react-router-hash-link";
import './UserLanding.css';
import config from '../config';
import { invokeApig } from "../libs/awsLibs";
import Helmet from 'react-helmet';

class EnrolledCourses extends Component {
  constructor(props){
    super(props);
    this.state = {
      courses:[]
    }
  }
  componentDidMount = async() => {
    try{
      var results = await this.loadEnrolledCourses();
      this.setState({courses:results});
    }catch(e){
      console.log('error getting enrolled courses');
      console.log(e);
    }
  }
  loadEnrolledCourses = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path: '/enrolment'
    })

  }
  render(){

    var enrolledCourses = this.state.courses.length === 0 ? (
      <div>You haven't enrolled in any courses yet.</div>
    ) : (
      <CardColumns>{ this.state.courses.map( (c,i) => {
        var courseComplete = c.progress.length === c.moduleCount;
        return (<Card key={i} className={`${courseComplete ? 'border border-success' : ''}`}>
          <CardBody>
            <CardTitle><Link to={`/courses/toc/${c.courseId}`}>{c.name}</Link></CardTitle>
            <CardText><strong>Progress</strong></CardText>
            <CardText>{c.progress.length} of {c.moduleCount} modules attended</CardText>
            { courseComplete ? <CardText className="text-success">Course Completed!!!</CardText> : null}
          </CardBody>
        </Card>)
      })}</CardColumns>
    );

    return (
      <div className="col-12">
        <h3>Enrolled Courses</h3>
        <hr />
        { enrolledCourses }
      </div>
    )
  }
}

/*
class CourseHighLights extends Component {
  render(){
    return (
      <div className="col-12 mb-3">
        <h3 id="highlights">Course Highlights</h3>
        <hr />
        <p>This one not yet implemented</p>
        <CardDeck>{ Array.from( Array(3).keys() ).map( (e,i) => {
          return (<Card key={i}>
            <CardImg top src= 'https://placehold.it/128x128'/>
            <CardBody>
              <h4 className="display-5 text-center">{loremIpsum()}</h4>
              <CardText>{loremIpsum({count:randomInt(3,5), unit:'paragraphs'})}</CardText>
              <CardText>RM 34.99</CardText>
            </CardBody>
            <CardFooter className="text-center">
              <Button color="primary">Learn More</Button>
            </CardFooter>
          </Card>);
        }) }</CardDeck>
      </div>
    );
  }
}
*/

export default class UserLanding extends Component {
  constructor(props){
    super(props);
    this.state = {courses:[], isLoading:false};
  }
  componentDidMount = async() => {
    var handle = this;
    //this.props.auth.parseCognitoWebResponse(curUrl);
    try {
      console.log('fetching user related courses ...');
      handle.setState({isLoading:true});
      var results = await this.getCourses();
      handle.setState({courses:results, isLoading:false});

      //parse
    } catch(e){
      console.log('error fetching user related courses');
      console.log(e);
    }

    //attempt to check username
    try {
      await this.checkIdent();
    } catch(e){
      console.log('error checking username');
      console.log(e);
    }

  }
  getCourses = () => {
    return invokeApig({
      path:'/courses/user'
    })
  }
  deleteCourse = (id) => {
    return invokeApig({
      path:`/courses/${id}`,
      method:'DELETE'
    })
  }
  handleDelete = async(e) => {
    var handle = this;

    if( window.confirm('Really delete?') ){
      console.log('now should relaly delete them;');
      try {
        await this.deleteCourse(e.target.id);
        // TODO: remove from state instead of polling again from server
        var results = await this.getCourses();
        handle.setState({courses:results});
      }catch(err){
        console.log('Error trying to delete');
        console.log(err);
      }
    }
  }
  checkIdent = () => {
    return invokeApig({
      endpoint: config.apiGateway.IDENT_URL,
      method: 'POST',
      path: '/check',
      queryParams: { username: this.props.currentUser['cognito:username']}
    });
  }
  render(){
    var handle = this;

    if(!this.props.isAuthenticated){
      return (<div>User is not authenticated</div>);
    }

    return (
      <Container className="text-left mt-2">
        <Helmet>
          <title>{`Welcome, ${handle.props.currentUser.name}`} - AutoTrainer</title>
        </Helmet>
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem active>{handle.props.currentUser.name}</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Row>
        <Row>
          <div className="col-12">
            <p className="lead">Welcome, {handle.props.currentUser.name}</p>
          </div>
          <div className="col-12 col-md-8 mb-3">
            <ul>
              <li><Link to="#enrolled">Enrolled Courses</Link></li>
              <li><Link to="#managed">Managed Courses</Link></li>
            </ul>
          </div>
          { /*
            -- to be implemented then you have more than 30 courses
            <CourseHighLights />
          */}
          <EnrolledCourses />
          <div className="col-12">
            <p><Button color="primary" to="/courses" tag={Link}>Explore Courses</Button></p>
          </div>
          <div className="col-12">
            <h3 id="managed">Your Managed Courses</h3>
            <hr />
            <p>Applicable if you have admin access</p>
          </div>
          <div className="col-12 col-md-8">
            { this.state.courses.length === 0 ? (<Notice className="mb-2" content={this.state.isLoading ? 'Loading courses ...' : 'No courses found.'}/>) : (
              this.state.courses.map( (e,i) => {
                return (<Card key={i} className="mb-3">
                  <CardBody>
                    <CardTitle>{e.name}</CardTitle>
                    { e.description.split('\n').map( (p,key) => {
                      return (<CardText key={key} className={key===0?'lead':''}>{p}</CardText>);
                    })}
                    <h4>Stats</h4>
                    <p>Modules: ({e.moduleCount}), Quiz questions: (y)</p>
                    <p>Price: RM{e.price}</p>
                    <Button className="mr-2 mb-2" color="info" tag={Link} to={`/courses/promo/${e.courseId}`}>Course Promo</Button>
                    <Button className="mr-2 mb-2" color="info" tag={Link} to={`/courses/toc/${e.courseId}`}>Table of Contents</Button>
                    <Button className="mr-2 mb-2" color="primary" tag={Link} to={`/user/course_builder/${e.courseId}`}>Manage</Button>
                    <Button className="mr-2 mb-2" color="danger" id={e.courseId} onClick={this.handleDelete}>Delete</Button>
                  </CardBody>
                </Card>);
              })
            )}
          </div>
          <div className="col-12">
            <Link className="btn btn-primary" to="/courses/new">New Course</Link>
          </div>
        </Row>
      </Container>
    )
  }
}
