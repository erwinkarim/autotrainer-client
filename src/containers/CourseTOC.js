import React, { Component } from "react";
import { Jumbotron, Container, Row, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import { CardColumns, Card, CardBody, CardTitle, CardText} from 'reactstrap';
import './CourseTOC.css';
import { Link } from 'react-router-dom';
import loremIpsum from 'lorem-ipsum';
import randomInt from 'random-int';

export default class CourseTOC extends Component {
  render(){
    return (
      <div>
        <Container className="mt-2">
          <Row>
          </Row>
          <Breadcrumb tag="nav">
            <BreadcrumbItem tag="a" href="/">Home</BreadcrumbItem>
            <BreadcrumbItem tag="a" href="/courses/tag">Course Tag</BreadcrumbItem>
            <BreadcrumbItem active>Course Name</BreadcrumbItem>
          </Breadcrumb>
        </Container>
        <Jumbotron fluid>
          <Container>
            <h1 className="display-3">Welcome to Subject!!!</h1>
            <p className="lead">Something about subject here</p>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <div className="col-12">
              <h3 className="display-4">Executive Summary</h3>
              <p className="lead">{loremIpsum()}</p>
            </div>
            <div className="col-12">
              <h3 className="display-4">Table of Contents</h3>
              <CardColumns>
                {
                  Array.from(Array(randomInt(5,10)).keys()).map( (e,i) => {
                  var isPopQuiz = 0.7 < Math.random();
                  return (<Card>
                    <CardBody key={i}>
                      <CardTitle>
                        <Link to={`${isPopQuiz ? "/courses/quiz" : "/courses/article"}`}>
                          {`${e}: ${isPopQuiz ? "(Quiz):" : ""}${loremIpsum()}`}
                        </Link>
                      </CardTitle>
                      <CardText>{loremIpsum()}</CardText>
                    </CardBody>
                  </Card>);
                }) }
              </CardColumns>
            </div>
            <div className="col-12">
              <h2 className="display-4">Additional Resources</h2>
              <ul className="text-left">
              { Array.from(Array(randomInt(3,8)).keys()).map( (e,i) => {
                return (<li key={i}>{ loremIpsum()}</li>);
              })}
              </ul>
            </div>
          </Row>
        </Container>
      </div>
    )
  }
}
