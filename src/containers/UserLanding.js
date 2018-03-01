import React, { Component } from "react";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import {CardColumns, Card, CardImg, CardTitle, CardBody, CardText, Button} from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
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
      courses:[], isLoading:false, modal:false,
      certContents:{}
    }
  }
  componentDidMount = async() => {
    console.log('attempt to get enrolled courses');
    try{
      this.setState({isLoading:true});
      var results = await this.loadEnrolledCourses();
      this.setState({courses:results, isLoading: false});
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
  toggleModal = (e) =>{
    this.setState({modal:!this.state.modal});

    if(!this.state.modal){
      //should update cert info
      var courseIndex = e.target.dataset.course;
      this.setState({
        certContents: this.state.courses[courseIndex]
      });
    }
  }
  render(){
    if(this.state.isLoading){
      return <Notice content="Checking enrolled courses ..." />
    };

    var enrolledCourses = this.state.courses.length === 0 ? (
      <div>You haven't enrolled in any courses yet.</div>
    ) : (
      <CardColumns>{ this.state.courses.map( (c,i) => {
        var courseComplete = c.progress.length >= c.publishedModuleCount;
        return (<Card key={i} className={`${courseComplete ? 'border border-success' : ''}`}>
          <CardBody>
            <CardTitle><Link to={`/courses/toc/${c.courseId}`}>{c.name}</Link></CardTitle>
            <CardText><strong>Progress</strong></CardText>
            <CardText>{c.progress.length} of {c.publishedModuleCount} modules attended</CardText>
            {
              courseComplete ?
              <CardText className="text-success">
                Course Completed <Button color="info" size="small" onClick={this.toggleModal} data-course={i}>View Cert</Button>
              </CardText> : null
            }
          </CardBody>
        </Card>)
      })}</CardColumns>
    );

    var certDate = new Date(this.state.certContents.certIssued);
    return (
      <Row>
        <div className="col-12">
          <h3>Enrolled Courses</h3>
          <hr />
          { enrolledCourses }
          <Modal isOpen={this.state.modal} onOpened={this.handleModalOpen} >
            <ModalHeader>Attendance Certificate</ModalHeader>
            <ModalBody>
              <p>ID: {this.state.certContents.certId}</p>
              <p>Issued: {certDate.toString()}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.toggleModal}>OK</Button>
            </ModalFooter>
          </Modal>
          <div className="col-12">
            <p><Button color="primary" to="/courses" tag={Link}>Explore Courses</Button></p>
          </div>
        </div>
      </Row>
    )
  }
}

class InvitedCourses extends Component {
  constructor(props){
    super(props);
    this.state = {
      courses:[], isLoading:false
    }
  }
  componentDidMount = async () => {
    //load invited courses
    this.setState({isLoading:true});
    try{
      var result = await this.loadInvitedCourses();
      this.setState({courses:result, isLoading:false});
    } catch(e){
      console.log('error loading invited courses');
      console.log(e);
    };

  }
  loadInvitedCourses = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path: '/enrolment/invited',
      queryParams: {email: this.props.email }
    });
  }
  render(){
    if(this.state.isLoading){
      return <Notice content="Loading courses invites ..." />;
    };

    return (
      <Row>
        <Col xs="12">
          <h3 id="invited">Invited Courses</h3>
          <hr />
        </Col>
        <Col xs="12">{
          this.state.courses.length === 0 ? (
            <Row><Col><p>You haven't been invited to any courses yet ...</p></Col></Row>
          ) : (
            <Row><Col><CardColumns>{ this.state.courses.map( (course,i) => {
              return (<Card key={i}>
                <div style={ {overflow:'hidden', height:'3em'}}>
                  <CardImg top src={ course.bg_pic } />
                </div>
                <CardBody>
                  <CardTitle className="text-center" tag="h2">{ course.name }</CardTitle>
                  <CardText className="lead">{course.description.split('\n')[0]}</CardText>
                  { course.description.split('\n').length > 1 ? <CardText>...</CardText> : null }
                  <Button className="mr-2 mb-2" color="info" tag={Link} to={`/courses/promo/${course.courseId}`} >View</Button>
                </CardBody>
              </Card>);
            })}</CardColumns></Col></Row>
          )
        }</Col>
      </Row>
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

class CourseManager extends Component {
  constructor(props){
    super(props);
    this.state = {
      courses:[], isLoading:false
    }
  }
  componentDidMount = async() => {
    var handle=this;
    console.log('attempt to get user related courses');
    try {
      handle.setState({isLoading:true});
      var results = await this.getCourses();
      handle.setState({courses:results, isLoading:false});
    } catch(e){
      console.log('error fetching user related courses');
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
  render = () => {
    if(this.state.isLoading){
      return <Notice content="Loading courses ..." />;
    };

    return(
      <Row>
        <div className="col-12">
          <h3 id="managed">Your Managed Courses</h3>
          <hr />
          <p>Applicable if you have admin or publisher roles</p>
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
                  <p>Modules: (Published: {e.publishedModuleCount}, Total: {e.moduleCount}), Quiz questions: (y)</p>
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

    )
  }
};

export default class UserLanding extends Component {
  constructor(props){
    super(props);
    this.state = {courses:[], isLoading:false};
  }
  componentDidMount = async() => {
    if(this.props.currentUser === null){
      return;
    }

    //attempt to check username
    try {
      await this.checkIdent();
    } catch(e){
      console.log('error checking username');
      console.log(e);
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

    if(this.props.isAuthenticating){
      return <Notice content="Authenticating session ..." />;
    }

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
              <li><Link to="#invited">Invited Courses</Link></li>
              <li><Link to="#managed">Managed Courses</Link></li>
            </ul>
          </div>
        </Row>
        <EnrolledCourses />
        <InvitedCourses email={this.props.currentUser.email} />
        {
          /*
          -- to be implemented then you have more than 30 courses
          <CourseHighLights />
          */
        }
        <CourseManager />
      </Container>
    )
  }
}
