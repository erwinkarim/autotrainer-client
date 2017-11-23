import React, { Component } from "react";
import {Jumbotron, Button, Container} from 'reactstrap';
import {Row,Card, CardBody, CardTitle, CardText, CardFooter} from 'reactstrap';
import { Link } from "react-router-dom";
import "./Home.css";
import loremIpsum from 'lorem-ipsum';

export default class Home extends Component {
  constructor(props){

    super(props);
    //console.log( fs.readdir(process.env.PUBLIC_URL));
    console.log(process.env.PUBLIC_URL);
  }
  render() {
    return (
      <div className="Home">
        <Jumbotron fluid className="mb-0">
          <Container>
            <h1 className="display-3">A Point is Made</h1>
            <p className="lead">{loremIpsum()}</p>
            <div className="d-flex">
              <Link className="btn btn-primary mx-auto" to='/'>Learn More</Link>
            </div>
          </Container>
        </Jumbotron>
        <Container className="mt-2">
          <Row>
           { ['bnm.png', 'hsbc_amanah.gif', 'takaful_ikhlas.png', 'etiqa.png', 'liberty_insurance.png',
             '7a603d_6d305286957b485db4d1148c7d4fcc02-mv2.webp', '7a603d_70c9ffa2ba1545eeb266efcf1c12ffda-mv2.webp',
             '7a603d_816d303f34f04c5392ea492d67d756a3-mv2.webp', '7a603d_8640671a7acd4d56be7107289af6eb3b-mv2.webp',
             'rhb.png', 'axa.png', '7a603d_61665b71f69e472d8cc57952922f0617-mv2.webp'].map( (e,i) => {
               return (
                <div className="col-3 col-md-2 mb-2" key={i}>
                 <img alt={e} className="img-fluid img-grayscale" src={`${process.env.PUBLIC_URL}/logos/${e}`} />
                </div>
               );
             })}
          </Row>
        </Container>
        <Jumbotron fluid className="mb-0">
          <Container>
            <h1 className="display- text-center">Another Point is Made</h1>
            <p className="lead">{loremIpsum()}</p>
            <div className="d-flex">
              <Button className="mx-auto" color="primary">Learn More</Button>
            </div>
          </Container>
        </Jumbotron>
        <Jumbotron className="mb-0">
          <Container>
            <h3 className="display-4 text-center">Featured Courses</h3>
            <Row>
              {
                [1,2,3].map( (e,i) => {
                  return (
                    <div key={i} className="col-12 col-md-4">
                      <Card className="mb-3">
                        <CardBody>
                          <CardTitle>Course {e}</CardTitle>
                          <CardText>{ loremIpsum()}</CardText>
                        </CardBody>
                        <CardFooter className="d-flex">
                          <Button className="mx-auto" color="primary">Learn More</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )
                })
              }
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}
