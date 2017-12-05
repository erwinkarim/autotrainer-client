import React, { Component } from "react";
import { Container, Row, Breadcrumb, BreadcrumbItem , Progress} from 'reactstrap'
import {CardDeck, Card, CardImg, CardTitle, CardBody, CardFooter, CardText, Button} from 'reactstrap';
import randomInt from 'random-int';
import loremIpsum from 'lorem-ipsum';
import { Link } from 'react-router-dom';
import './UserLanding.css';
import { invokeApig } from "../libs/awsLibs";

export default class UserLanding extends Component {
  constructor(props){
    super(props);
    this.state = {courses:[]};
  }
  componentDidMount = async() => {
    var handle = this;
    try {
      var results = await this.getCourses();
      console.log('results', results);
      handle.setState({courses:results});
    } catch(e){
      console.log(e);
    }

  }
  getCourses = () => {
    return invokeApig({
      path:'/courses/user'
    })
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
          <div className="col-12 mb-3">
            <h4 className="display-5">Course Highlights</h4>
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
            <h4 className="display-5">Courses you attended</h4>
            <p>Some gamification of the courses you bought</p>
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
            <h4 className="display-4">Courses you manage</h4>
            <p>Applicable if you have admin access</p>
          </div>
          <div className="col-12 col-md-8">
            { this.state.courses.length === 0 ? (<div>No courses yet ...</div>) : (
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
                    <p>
                      <Button className="mr-2" color="info" tag={Link} to={`/courses/promo/${e.courseId}`}>Course Promo</Button>
                      <Button className="mr-2" color="info" tag={Link} to={`/courses/toc/${e.courseId}`}>Table of Contents</Button>
                      <Button color="primary" tag={Link} to={`/user/course_builder/${e.courseId}`}>Edit</Button>
                    </p>
                  </CardBody>
                </Card>);
              })
            )}
            <p>...Load from DynamoDB here...</p>
          </div>
          <div className="col-12">
            <Link className="btn btn-primary" to="/courses/new">New Course</Link>
          </div>
        </Row>
      </Container>
    )
  }
}
