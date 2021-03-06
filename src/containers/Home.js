import React from 'react';
import { Jumbotron, Container, Row, Col, CardDeck, Card, CardBody, CardText, CardTitle, CardFooter, Button } from 'reactstrap';
// import { Link } from "react-router-dom";
import { HashLink as Link } from 'react-router-hash-link';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import SignUpModal from '../components/SignUpModal';
import config from '../config';
import './Home.css';

/**
 * Home
 * @param {int} props The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */
const Home = props =>
  (
    <div className="Home">
      <Helmet>
        <title>
          {config.site_name} - We Provide Actuarial, Insurance and Financial Training Programs
        </title>
      </Helmet>
      <Jumbotron fluid className="mb-0 position-relative py-0 text-center" id="jumbotron-1">
        <div id="video-1" className="video-container">
          <video playsInline autoPlay muted loop>
            <track kind="captions" />
            <source src="//d1kb8zqkhtl5kk.cloudfront.net/learn.mp4" />
          </video>
        </div>
        <div id="panel-1" className="position-absolute" />
        <Container id="panel-2" className="text-white position-absolute">
          <h3 className="display-4">We Provide Actuarial, Insurance and Financial Training Programs</h3>
          <div className="">
            {
              props.currentUser === null ? (
                <Button
                  color="primary"
                  className="mr-2"
                  onClick={() => { props.addNotification('Logging in ...', 'info'); props.auth.getSession(); }}
                >
                  REGISTER NOW
                </Button>
              ) : <Link href="/" to="/courses" className="btn btn-primary mr-2">EXPLORE</Link>
            }
            <Link href="/" className="btn btn-secondary" to="/#video">WATCH VIDEO</Link>
          </div>
        </Container>
      </Jumbotron>
      <Container className="mt-2">
        <Row>
          { ['256x256 BKR-rd.png', '256x256 IIT-rd.png', '256x256 KN-rd.png', '256x256 TI-rd.png',
          '256x256 TMIG-rd.png', '256x256 WBG-rd.png'].map(e => (
            <div className="col-4 col-md-2 mb-2" key={e}>
              <img alt={e} className="img-fluid img-grayscale" src={`${process.env.PUBLIC_URL}/logos/${e}`} />
            </div>
          ))}
        </Row>
      </Container>
      <Container className="text-left">
        <h1 className="display-3">Learn. Experince. Succeed.</h1>
        <h4 className="text-muted">Experienced practitioners providing you with real world knowledge.</h4>
        <p className="lead">learn@AP is the learning and development business of Actuarial Partners Consulting</p>
        <p>
          Since 2015, we have trained more than 500 people through our public workshops, in-house
          training programs and conferences on various technical subjects relating to actuarial,
          insurance and finance. These programs has assisted our clients and partners in developing
          their actuarial human capital.
        </p>
        <p>
          Our courses are delivered by highly experienced and qualified practicineers who posses
          both the depth of knowledge as well as the practical experience in the relevant
          subject matter.
        </p>
        <p>
          We seek to deliver the most effective (and fun) learning experience for our clients by
          incorporating new and innovative learning method
        </p>
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
              <Button color="primary" className="mx-auto" to="/login" tag={Link}>
                Register Now
              </Button>
            </div>
          </Row>
        </Container>
      </Jumbotron>
        */
      }
      <Jumbotron fluid className="mb-0 py-0">
        <div id="video" className="embed-responsive embed-responsive-16-by-9 video-container">
          <video controls className="" poster="/images/home-keynote-image.jpg">
            <track kind="captions" />
            <source src="//d1kb8zqkhtl5kk.cloudfront.net/learn.mp4" />
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
                  <CardText>
                    With nearly 100 years of combined consulting experience,
                    our partners are not only leaders in their field but are
                    progressive and forward-thinking innovators.
                  </CardText>
                </CardBody>
                <CardFooter>
                  <Button tag={Link} to="/about" color="info" outline>Learn More</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardBody>
                  <CardTitle>Keep in Touch</CardTitle>
                  <CardText>
                    Join our newsletter to stay inform of the latest from learn@AP
                  </CardText>
                </CardBody>
                <CardFooter>
                  <SignUpModal {...props} />
                </CardFooter>
              </Card>
            </CardDeck>
          </Col>
        </Row>
      </Container>
    </div>
  );

Home.propTypes = {
  addNotification: PropTypes.func.isRequired,
  auth: PropTypes.shape().isRequired,
  currentUser: PropTypes.shape(),
};

Home.defaultProps = {
  currentUser: null,
};

export default Home;
