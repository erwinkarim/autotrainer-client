import React from 'react';
import { Container, Row, Col, Jumbotron, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const Tutorial = () => (
  <div className="mb-2">
    <Jumbotron fluid>
      <Container>
        <h4>Tutorial</h4>
      </Container>
    </Jumbotron>
    <Container>
      <Row>
        <Col>
          <p>Talk about tutorial here and expect what you will get from this tutorial</p>
          <Button color="primary" tag={Link} to="/tutorials/user_landing">Start Tutorial</Button>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Tutorial;
