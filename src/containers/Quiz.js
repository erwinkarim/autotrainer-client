import React, { Component } from "react";
import { Container, Jumbotron, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { CardDeck, Card, CardBody, CardText, CardTitle, Button} from 'reactstrap';
import {Carousel, CarouselItem} from 'reactstrap';
import {FormGroup, Label, Input} from 'reactstrap';
import { Link } from 'react-router-dom';
import randomInt from 'random-int'
import loremIpsum from 'lorem-ipsum';
import './Quiz.css';


export default class Quiz extends Component {
  /*
    TODO: stop render new things everytime you cilck something
  */
  render(){
    return (
      <div>
        <Container className="mt-2 text-left">
          <Row>
            <div className="col-12">
              <Breadcrumb>
                <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
                <BreadcrumbItem><Link to="/courses/tag">Course Tag</Link></BreadcrumbItem>
                <BreadcrumbItem><Link to="/courses/toc">Course Name</Link></BreadcrumbItem>
                <BreadcrumbItem active>Module X: Blah, Blah, Blah</BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Row>
          <Row>
            <div className="col-12">
              <CardDeck>
                <Card>
                  <CardBody>
                    <CardTitle tag="h2">Inline style</CardTitle>
                    <Button color="primary" tag="a" className="text-center" href="#inline">View</Button>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <CardTitle tag="h2">Carousel style</CardTitle>
                    <Button color="primary" tag="a" className="text-center" href="#carousel">View</Button>
                  </CardBody>
                </Card>
              </CardDeck>
            </div>
            <div className="col-12 col-md-8 mt-3" id="inline">
              <h2 className="display-4">Inline Style</h2>
              { Array.from( Array(randomInt(5,10)).keys() ).map( (e,i) => {
                return (<Card key={i} className="mb-3">
                  <CardBody>
                    <CardText>{`Question ${i+1}:`} </CardText>
                    <CardText className="lead">{ loremIpsum()}?</CardText>
                    { Array.from( Array(randomInt(3,6)).keys() ).map( (e2,i2) => {
                      return (<FormGroup key={i2} check>
                        <Label check><Input type="radio" name={`radio-${i}`} /> { loremIpsum()}</Label>
                      </FormGroup>);
                    })}
                  </CardBody>
                </Card>)
              })}
              <p>
                <Button color="primary mr-2">Submit Answer</Button>
                <Button color="secondary">Do Over</Button>
              </p>
            </div>
            <div className="col-12">
              <h2 className="display-2">Carousel Style</h2>
            </div>
          </Row>
        </Container>
        <Jumbotron fluid id="carousel">
          <Container>
            <Carousel activeIndex={0} id="carousel-example">{ Array.from( Array( randomInt(3,6) ).keys()).map( (e,i) => {
              return (<CarouselItem key={i}>
                <Card className="text-left">
                  <CardBody>
                    <CardText className="lead">{ loremIpsum()}?</CardText>
                    { Array.from( Array(randomInt(2,4) ).keys() ).map( (e2,i2) => {
                      return (<FormGroup key={i}>
                        <Label check>
                          <Input type="radio" name={`radio-carousel-${i}`} /> {loremIpsum()}.
                        </Label>
                      </FormGroup>)
                    })}
                    <CardText>
                      <Button tag="a" color="primary" data-slide="next" href="#carousel-example">Next Question</Button>
                    </CardText>
                  </CardBody>
                </Card>
              </CarouselItem>)
            })}</Carousel>
          </Container>
        </Jumbotron>
      </div>
    )
  }
}
