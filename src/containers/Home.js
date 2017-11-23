import React, { Component } from "react";
import {Jumbotron, Button, Container} from 'reactstrap';
import {Row, CardDeck,Card, CardBody, CardTitle, CardText, CardFooter} from 'reactstrap';
import { Link } from "react-router-dom";
import "./Home.css";
import loremIpsum from 'lorem-ipsum';
import randomInt from 'random-int';

export default class Home extends Component {
  constructor(props){

    super(props);
    //console.log( fs.readdir(process.env.PUBLIC_URL));
    console.log(process.env.PUBLIC_URL);
  }
  render() {
    return (
      <div className="Home">
        <Jumbotron fluid className="mb-0" id="jumbotron-1">
          <Container className="text-white pb-3" id="panel-1">
            <h1 className="display-3">A Point is Made</h1>
            <p className="lead">{loremIpsum()}</p>
            <div className="">
              <Link className="btn btn-primary mr-2" to='/'>Learn More</Link>
              <Button tag="a" href="#video">Watch Video</Button>
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
        <Jumbotron className="mb-0">
          <Container>
            <h3 className="display-4 text-center">Another Point is Made</h3>
            <Row>
              <CardDeck>{
                [1,2,3].map( (e,i) => {
                  return (
                    <Card className="mb-3">
                      <CardBody>
                        <CardTitle>Course {e}</CardTitle>
                        <CardText>{ loremIpsum()}</CardText>
                      </CardBody>
                    </Card>
                  )
                })
              }</CardDeck>
              <div className="col-12 d-flex">
                <Button color="primary" className="mx-auto" href="/login" tag="a">Register Now</Button>
              </div>
            </Row>
          </Container>
        </Jumbotron>
        <Jumbotron fluid className="mb-0">
          <div id="video" className="embed-responsive embed-responsive-16-by-9" style={{height:'80vh', width:'100vw'}}>
            <iframe src="https://www.youtube.com/embed/pk6BhWxlWXc" width="1600"></iframe>
          </div>
          <Container>
            <h1 className="display-3">Final Points</h1>
            <p className="lead text-left">{loremIpsum({count:randomInt(2,4), unit:'sentances'})}</p>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}
