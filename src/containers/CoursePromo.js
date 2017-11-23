import './CoursePromo.css';
import React, { Component } from "react";
import {Container, Jumbotron, Row} from 'reactstrap';
import {CardColumns, CardDeck, Card, CardBody, CardTitle, CardText, CardFooter, Button, Badge} from 'reactstrap';
import randomInt from 'random-int';
import loremIpsum from 'lorem-ipsum';

export default class CoursePromo extends Component {
  render(){
    return (
      <div>
        <Jumbotron fluid>
          <Container>
            <h1 className="display-3 text-center">Course Title</h1>
            <p className="lead">{loremIpsum()}</p>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <div className="col-12 mb-2">
              <h2 className="display-4 text-center">Short Key Points</h2>
              <CardDeck>{
                [1,2,3].map( (e,i) => {
                  return (
                    <Card key={i}>
                      <CardBody>
                        <CardTitle className="text-center">Key Point {i}</CardTitle>
                        <CardText>{loremIpsum()}</CardText>
                      </CardBody>
                      <CardFooter className="d-flex">
                        <Button color="primary" className="mx-auto">Learn More</Button>
                      </CardFooter>
                    </Card>
                  )
                })

              }</CardDeck>
            </div>
            <div className="col-12 mb-2">
              <h2 className="display-4 text-center">Recent Customers</h2>
            </div>
            { ['bnm.png', 'hsbc_amanah.gif', 'takaful_ikhlas.png', 'etiqa.png', 'liberty_insurance.png',
             'rhb.png'].map( (e,i) => {
               return (
                <div className="col-3 col-md-2 mb-2" key={i}>
                 <img alt={e} className="img-fluid img-grayscale" src={`${process.env.PUBLIC_URL}/logos/${e}`} />
                </div>
               );
             })}
          </Row>
        </Container>
        <Jumbotron fluid>
          <Container>
            <h1 className="display-3">Pricing</h1>
            <p className="lead">Just RM39.99</p>
            <div className="d-flex">
              <Button color="primary" className="mx-auto">Get Started!</Button>
            </div>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <div className="col-12">
              <h4 className="display-4">Table of Contents</h4>
            </div>
            <div className="col-12">
              <CardColumns>{ Array.from( Array(12).keys() ).map( (e,i) => {
                return (<Card key={i} className="text-left">
                  <CardBody>
                    <CardTitle>{loremIpsum({count:randomInt(3,5), units:'words'})}</CardTitle>
                    <CardText>{loremIpsum({count:randomInt(2,3) })}</CardText>
                  </CardBody>
                </Card>);
              })}</CardColumns>
            </div>
            <div  className="col-12">
              <Button color="primary">Get Started!!!</Button>
            </div>
          </Row>
          <Row>
            <div className="col-12">
              <h3 className="display-4">Final Thoughts</h3>
              { [1,2,3].map( (e,i) => {
                return (<p className="lead" key={i}>{loremIpsum()}</p>)
              })}
              <p>
              { [1,2,3].map( (e,i) => {
                return (<Badge key={i} href="#" color="secondary" className="mr-2">{loremIpsum({count:2, units:'words'})}</Badge>)
              })}
              </p>
            </div>
          </Row>
        </Container>
      </div>
    )

  }
}
