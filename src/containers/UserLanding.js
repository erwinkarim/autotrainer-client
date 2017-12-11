import React, { Component } from "react";
import { Container, Row, Breadcrumb, BreadcrumbItem , Progress} from 'reactstrap'
import {CardDeck, Card, CardImg, CardTitle, CardBody, CardFooter, CardText, Button} from 'reactstrap';
import randomInt from 'random-int';
import loremIpsum from 'lorem-ipsum';
import Notice from '../components/Notice';
import { HashLink as Link } from "react-router-hash-link";
import './UserLanding.css';
import { invokeApig } from "../libs/awsLibs";

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
  render(){
    var courseCount = randomInt(20);
    var handle = this;

    if(!this.props.isAuthenticated){
      return (<div>User is not authenticated</div>);
    }

    return (
      <Container className="text-left mt-2">
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
              <li><Link to="#highlights">Course Highlights</Link></li>
              <li><Link to="#enrolled">Enrolled Courses</Link></li>
              <li><Link to="#managed">Managed Courses</Link></li>
            </ul>
          </div>
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
          <div className="col-12">
            <h3 id="enrolled">Enrolled Courses</h3>
            <hr />
            <p>Some gamification of the courses you bought</p>
            <p>This one not yet implemented</p>
            { 0 === courseCount ? (
              <div>
                <p>No courses yet ... </p>
                <p><Button color="primary" tag="a" href="#">View Courses</Button></p>
              </div>
            ) : (<Row>{ Array.from( Array(courseCount).keys() ).map( (e,i) => {
              return (<div key={i} className="col-12 col-md-3">
                <Card key={i} className="mb-2">
                  <CardBody>
                    <CardTitle tag="h4">
                      <a href="/courses/toc">{loremIpsum()}</a>
                    </CardTitle>
                    <CardText>Page</CardText>
                    <Progress color="info" value={randomInt(1,100)} />
                    <CardText>Quiz</CardText>
                    <Progress color="success" value={randomInt(1,100)} />
                  </CardBody>
                </Card>
              </div>);
            })}
            </Row>)}
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
                    <p>Chapters: (x), Quiz questions: (y)</p>
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
