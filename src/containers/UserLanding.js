import React, { Component } from "react";
import { Container, Row, Breadcrumb, BreadcrumbItem , Progress} from 'reactstrap'
import {CardDeck, Card, CardImg, CardTitle, CardBody, CardFooter, CardText, Button} from 'reactstrap';
import randomInt from 'random-int';
import loremIpsum from 'lorem-ipsum';
import { Link } from 'react-router-dom';
import './UserLanding.css';


export default class UserLanding extends Component {
  render(){
    var courseCount = randomInt(20);

    return (
      <Container className="text-left mt-2">
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem active>FirstName LastName</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Row>
        <Row>
          <div className="col-12">
            <p className="lead">Welcome, FirstName LastName</p>
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
          <div className="col-12 col-md-8">{ Array.from( Array(randomInt(0,4)).keys()).map( (e,i) => {
            return (<Card key={i} className="mb-3">
              <CardBody>
                <CardTitle>{loremIpsum()}</CardTitle>
                <CardText className="lead">{loremIpsum({count:randomInt(1,2), unit:'paragraphs'})}</CardText>
                <h4>Stats</h4>
                <p>Chapters: {randomInt(5,12)}, Quiz questions: {randomInt(5,30)}</p>
                <p>Price: RM39.99</p>
                <p>
                  <Button className="mr-2" color="info" tag="a" href="/courses/toc">View Course</Button>
                  <Button color="primary" tag="a" href="/user/course_builder">Edit</Button>
                </p>
              </CardBody>
            </Card>);

          })}</div>
        </Row>
      </Container>
    )
  }
}
