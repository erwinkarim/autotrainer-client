import React from 'react';
import { Container, Row, Col, Jumbotron, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const backgroundStyle = {
  backgroundImage: 'url(/images/tutorial/main.jpg)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '50vh',
};

const titleStyle = {
  color: 'white',
  textShadow: '2px 2px 1px black',
};

const Tutorial = () => (
  <div className="mb-2">
    <Jumbotron fluid style={backgroundStyle}>
      <Container>
        <h2 style={titleStyle}>Tutorial</h2>
      </Container>
    </Jumbotron>
    <Container>
      <Row>
        <Col>
          <p>
            Thank you for choosing learn@AP as your learning platform on things actuarial,
            finance and investment. Please do take some time with this tutorial to get yourself
            acquainted with the learn@AP course system to get the maximum benefit out of learn@AP.
            Click the button below to begin.
          </p>
          <Button color="primary" tag={Link} to="/tutorials/user_landing">Start Tutorial</Button>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Tutorial;
