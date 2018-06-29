import React from 'react';
import { Container, Row, Col, Jumbotron, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const TutorialUserLanding = () => (
  <Container className="my-2">
    <Row>
      <Col>
        <h2>Step 5 of the tutorial</h2>
        <p>perhaps some content about the PDF viewer??</p>
      </Col>
    </Row>
    <Row>
      <Col>
        <Button className="mr-2">Start Again</Button>
        <Button color="primary" tag={Link} to="/tutorials">Restart the tutorial</Button>
      </Col>
    </Row>
  </Container>
);

export default TutorialUserLanding;
