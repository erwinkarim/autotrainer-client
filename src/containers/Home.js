import React, { Component } from "react";
import {Jumbotron, Button, Container} from 'reactstrap';
import {Row, CardDeck,Card, CardBody, CardTitle, CardText} from 'reactstrap';
//import { Link } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
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
        <Jumbotron fluid className="mb-0 position-relative py-0" id="jumbotron-1">
          <div id="video-1" className="video-container">
            <video playsInline autoPlay muted={true} loop>
              <source src={`//d1kb8zqkhtl5kk.cloudfront.net/learn.mp4`} />
            </video>
          </div>
          <div id="panel-1" className="position-absolute">
          </div>
          <Container id="panel-2" className="text-white position-absolute">
              <h3 className="display-4">We Provide Actuarial, Insurance and Financial Training Programs</h3>
              <div className="">
                <Link className="btn btn-primary mr-2" to='/'>REGISTER NOW</Link>
                <Link className="btn btn-secondary" to='/#video'>WATCH VIDEO</Link>
              </div>
          </Container>
        </Jumbotron>
        <Container className="mt-2">
          <Row>
           { ['256x256 BKR-rd.png','256x256 IIT-rd.png', '256x256 KN-rd.png', '256x256 TI-rd.png',
              '256x256 TMIG-rd.png', '256x256 WBG-rd.png' ].map( (e,i) => {
               return (
                <div className="col-4 col-md-2 mb-2" key={i}>
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
                    <Card key={i} className="mb-3">
                      <CardBody>
                        <CardTitle>Course {e}</CardTitle>
                        <CardText>{ loremIpsum()}</CardText>
                      </CardBody>
                    </Card>
                  )
                })
              }</CardDeck>
              <div className="col-12 d-flex">
                <Button color="primary" className="mx-auto" to="/login" tag={Link}>Register Now</Button>
              </div>
            </Row>
          </Container>
        </Jumbotron>
        <Jumbotron fluid className="mb-0">
          <div id="video" className="embed-responsive embed-responsive-16-by-9" style={{height:'80vh', width:'100vw'}}>
            <video controls poster="/videos/668515766_1200x680.webp">
              <source src={`//d1kb8zqkhtl5kk.cloudfront.net/learn.mp4`} />
            </video>
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
