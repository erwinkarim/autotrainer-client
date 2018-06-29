import React from 'react';
import { Container, Row, Col, Jumbotron, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const TutorialCoursePromo = () => (
  <Container className="my-2">
    <Row>
      <Col>
        <h2>Step 2 of the tutorial</h2>
        <p>perhaps some content about a typical course page and how to enrol ??</p>
      </Col>
    </Row>
    <Row>
      <Col>
        <Button className="mr-2">Start Again</Button>
        <Button color="primary" tag={Link} to="/tutorials/course_toc">Continue ...</Button>
      </Col>
    </Row>
  </Container>
);

export default TutorialCoursePromo;
