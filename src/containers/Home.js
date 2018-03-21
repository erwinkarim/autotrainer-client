import React, { Component } from "react";
import {Jumbotron, Container, Row, Col } from 'reactstrap';
import {CardDeck, Card, CardBody, CardText, CardTitle, CardFooter, Button } from 'reactstrap';
import { Modal, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
//import { Link } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import EmailValidator from 'email-validator';
import Helmet from 'react-helmet';
import config from '../config';
import Waypoint from 'react-waypoint';
import FontAwesome from 'react-fontawesome';
import "./Home.css";

const client = require("@sendgrid/client");
client.setApiKey(process.env.REACT_APP_SENDGRID_KEY);

class SignUpModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      showNewsletterModal:false,
      signup_email:'', first_name:'', last_name:'',
      signing_up: false,
      waypointTriggered:false,
    }
  }
  launchNewsletterModal = () =>{
    console.log('should launch news letter modal');
    this.setState({showNewsletterModal:true});
  }
  handleNewsletterSignUp = async (e) => {
    console.log('should send email to sendgrid / mailchimp');

    // param to post to sendgrid
    const request = {
      method:'POST',
      url: '/v3/contactdb/recipients',
      body: [ { email: this.state.signup_email, first_name:this.state.first_name , last_name: this.state.last_name } ]
    };

    this.setState({signing_up:true});

    await client.request(request)
      .then( ([response,body]) => {
          console.log('email signed up');
      });

    this.props.addNotification('Thank you for signing up', 'info');

    //reset
    this.setState({signing_up:false, showNewsletterModal:false,
      signup_email:'', first_name:'', last_name:''});

  }
  toggleModal = (e) => {
    this.setState({showNewsletterModal: !this.state.showNewsletterModal});
  }
  triggerWaypoint = () => {
    //trigger the waypoint only once per render
    if(!this.state.waypointTriggered){
      this.setState({waypointTriggered:true});
      this.toggleModal();
    }
  }
  validateFirstName = () => { return this.state.first_name.length > 0; }
  validateLastName = () => { return this.state.last_name.length > 0; }
  validateNewsletterModal = () => { return EmailValidator.validate(this.state.signup_email); }
  render = () => {
    return (
      <div>
        <Button outline color="info" onClick={this.launchNewsletterModal}>Join Newsletter</Button>
        <Waypoint onEnter={this.triggerWaypoint} />
        <Modal isOpen={this.state.showNewsletterModal} toggle={this.toggleModal} size="lg">
          <ModalBody>
            <p>Stay informed of the latest updates by joining our newsletter:</p>
              <FormGroup row>
                <Col xs="12" md="6" className="mb-2">
                  <Input type="text" value={this.state.first_name}
                    ref={ (input) => {this.first_name = input;} }
                    invalid={ !this.validateFirstName() }
                    onChange={ (e) => this.setState({first_name:e.target.value})} placeholder="First Name"/>
                </Col>
                <Col xs="12" md="6" className="">
                  <Input type="text" value={this.state.last_name}
                    invalid={ !this.validateLastName() }
                    onChange={ (e) => this.setState({last_name:e.target.value})} placeholder="Last Name"/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Input type="email" value={ this.state.signup_email }
                  invalid={ !this.validateNewsletterModal() }
                  onChange={ (e) => this.setState({signup_email:e.target.value})} placeholder="email address" />
              </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button outline color="danger" onClick={ this.toggleModal }>No Thanks</Button>
            <Button color="primary" onClick={ this.handleNewsletterSignUp }
              disabled={ !(this.validateNewsletterModal() && this.validateFirstName() && this.validateLastName() ) || (this.state.signing_up) }>
                { this.state.signing_up ? <FontAwesome name="asterisk" spin /> : null }
                Sign Up
            </Button>
          </ModalFooter>
        </Modal>
      </div>

    )

  }

}
export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <Helmet>
          <title>{config.site_name} - We Provide Actuarial, Insurance and Financial Training Programs</title>
        </Helmet>
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
        <Container className="text-left">
          <h1 className="display-3">Learn. Experince. Succeed.</h1>
          <h4 className="text-muted">Experienced practitioners providing you with real world knowledge.</h4>
          <p className="lead">learn@AP is the learning and development business of Actuarial Partners Consulting</p>
          <p>Since 2015, we have trained more than 500 people through our public workshops, in-house training programs and conferences on various technical subjects relating to actuarial, insurance and finance. These programs has assisted our clients and partners in developing their actuarial human capital.</p>
          <p>Our courses are delivered by highly experienced and qualified practicineers who posses both the depth of knowledge as well as the practical experience in the relevant subject matter.</p>
          <p>We seek to deliver the most effective (and fun) learning experience for our clients by incorporating new and innovative learning method </p>
        </Container>
        {
          /*
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
          */
        }
        <Jumbotron fluid className="mb-0 py-0">
          <div id="video" className="embed-responsive embed-responsive-16-by-9 video-container">
            <video controls className="" poster="/images/home-keynote-image.jpg">
              <source src={`//d1kb8zqkhtl5kk.cloudfront.net/learn.mp4`} />
            </video>
          </div>
          {
            /*
          <Container>
            <h1 className="display-3">Final Points</h1>
            <p className="lead text-left">{loremIpsum({count:randomInt(2,4), unit:'sentances'})}</p>
          </Container>
            */
          }
        </Jumbotron>
        <Container className="mt-2">
          <Row>
            <Col>
            <CardDeck>
              <Card>
                <CardBody>
                  <CardTitle>About Actuarial Partners</CardTitle>
                  <CardText>With nearly 100 years of combined consulting experience, our partners are not only leaders in their field but are progressive and forward-thinking innovators.</CardText>
                </CardBody>
                <CardFooter>
                  <Button tag={Link} to="/about" color="info" outline>Learn More</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardBody>
                  <CardTitle>Keep in Touch</CardTitle>
                  <CardText>Join our newsletter to stay inform of the latest from learn@AP</CardText>
                </CardBody>
                <CardFooter>
                  <SignUpModal {...this.props} />
                </CardFooter>
              </Card>
            </CardDeck>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
