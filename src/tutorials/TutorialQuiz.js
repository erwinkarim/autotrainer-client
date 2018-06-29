import React from 'react';
import { Container, Row, Col, Jumbotron, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const TutorialUserLanding = () => (
  <Container className="my-2">
    <Row>
      <Col>
        <h2>Step 4 of the tutorial</h2>
        <p>perhaps some content about quiz page ??</p>
      </Col>
    </Row>
    <Row>
      <Col>
        <Button className="mr-2">Start Again</Button>
        <Button color="primary" tag={Link} to="/tutorials/doc">Continue ...</Button>
      </Col>
    </Row>
  </Container>
);

export default TutorialUserLanding;
