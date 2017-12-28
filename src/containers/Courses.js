import React, { Component } from "react";
import AWS from 'aws-sdk'
import { Container, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { CardColumns, Card, CardBody, CardTitle, CardText, CardFooter, Button} from 'reactstrap';
import {Link} from 'react-router-dom';
import './Courses.css'
import { invokeApig } from "../libs/awsLibs";
import Notice from '../components/Notice';
import config from '../config';
import Helmet from 'react-helmet';

class CourseCard extends Component {
  render(){
    const course = this.props.course;
    const identityId = AWS.config.credentials._identityId;

    return (
      <Card>
        <CardBody>
          <CardTitle><Link to={`/courses/promo/${course.courseId}`}>{course.name}</Link></CardTitle>
          <CardText className="lead">{course.tagline}</CardText>
          <CardText className="text-justify">{course.description.split('\n')[0]}</CardText>
        </CardBody>
        <CardFooter>{
          this.props.course.userId === identityId ? (<span>You own this course</span>) :
          this.props.enrolments.find( (e) => { return e.courseId === this.props.course.courseId;}) === undefined ?
            (<Button color="primary" tag={Link} to={`/courses/promo/${this.props.course.courseId}`}>Learn More</Button>) :
            (<span>Enroled</span>)
        }
        </CardFooter>
      </Card>
    )
  }
}

export default class Courses extends Component {
  constructor(props){
    super(props);

    this.state = {courses:[], enrolments:[]};
  }
  componentDidMount = async() => {
    try{
      var results = await this.getCourses();
      var enrolmentResults = await this.getEnrolment();
      this.setState({courses:results, enrolments: enrolmentResults});
    }catch(e){
      console.log('error getting courses');
      console.log(e);
    }

  }
  getCourses = () => {
    return invokeApig({
      path:'/courses'
    });
  }
  getEnrolment = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path:'/enrolment'
    });
  }
  render(){
    if(!this.props.isAuthenticated){
      return (<div>User is not authenticated</div>);
    };

    if(AWS.config.credentials === null){
      return (<div>Credentials are not set</div>);
    }

    if(this.state.courses.length === 0){
      return (<Notice content="Courses not found" />);
    };


    return (
      <Container className="mt-2">
        <Helmet>
          <title>Courses - AutoTrainer</title>
        </Helmet>
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem active>Courses</BreadcrumbItem>
            </Breadcrumb>
            <CardColumns>{ this.state.courses.map( (c,i) => {
              return (<CourseCard key={i} course={c} enrolments={this.state.enrolments} {...this.props}/>)
            })}
            </CardColumns>
          </div>
        </Row>
      </Container>
    )
  }
}
