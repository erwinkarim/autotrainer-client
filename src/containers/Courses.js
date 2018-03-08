import React, { Component } from "react";
import AWS from 'aws-sdk'
import { Container, Row, Col } from 'reactstrap'
import { CardColumns, Card, CardBody, CardTitle, CardText, CardFooter, Button} from 'reactstrap';
import { Form, FormGroup, Label, Input } from 'reactstrap';
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
            (<Button color="info" tag={Link} to={`/courses/toc/${this.props.course.courseId}`}>Enroled</Button>)
        }
        </CardFooter>
      </Card>
    )
  }
}

export default class Courses extends Component {
  constructor(props){
    super(props);

    this.state = {courses:[], enrolments:[], loading:true, show_mode:'published_only'};
  }
  handleAdminChange = async (e) => {
    console.log('changing show mode');
    var newPublishMode = e.target.value;
    await this.setState({show_mode:newPublishMode});

    //reload the course w/ new option
    try {
      var results = await this.getCourses();
      this.setState({courses:results});
    } catch(e){
      console.log('error reloading courses');
      console.error(e);
    }
  }
  componentDidMount = async() => {
    try{
      var results = await this.getCourses();
      var enrolmentResults = await this.getEnrolment();
      this.setState({courses:results, enrolments: enrolmentResults, loading: false});
    }catch(e){
      console.log('error getting courses');
      console.log(e);
    }

  }
  getCourses = () => {
    console.log('show_mode', this.state.show_mode);
    return invokeApig({
      path:'/courses',
      queryParams: { show_mode: this.state.show_mode }
    });
  }
  getEnrolment = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path:'/enrolment'
    });
  }
  render(){
    if(this.state.loading){
      return <Notice content="Loading ..." />;
    };

    if(!this.props.isAuthenticated){
      return (<div>User is not authenticated</div>);
    };

    if(AWS.config.credentials === null){
      return (<div>Credentials are not set</div>);
    }

    if(this.state.courses.length === 0){
      return (<Notice content="Courses not found" />);
    };

    var isAdmin = this.props.currentUser['cognito:groups'].includes('admin');

    return (
      <Container className="mt-2">
        <Helmet>
          <title>Courses - {config.site_name}</title>
        </Helmet>
        <Row>
          {
            isAdmin ?
              <Col xs="12" className="mb-2">
                <Card body>
                  <Form inline>
                    <FormGroup>
                      <Label className="mr-2">Admin options: Status mode</Label>
                      <Input type="select" value={this.state.show_mode} onChange={this.handleAdminChange}>
                        <option value="all">Show all courses</option>
                        <option value="published_only">Show published only</option>
                      </Input>
                    </FormGroup>
                  </Form>
                </Card>
              </Col>
            : null
          }
          <div className="col-12">
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
