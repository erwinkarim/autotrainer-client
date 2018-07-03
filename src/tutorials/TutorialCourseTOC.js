import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Module from '../containers/Module';
import config from '../config';

const TutorialCourseTOC = props => (
  <div>
    <Container className="my-2">
      <Row>
        <Col>
          <h2>Step 3 of the tutorial</h2>
          <p>perhaps some content about a typical course TOC page ??</p>
          <hr />
        </Col>
      </Row>
    </Container>
    <Module courseId={config.tutorial.course} moduleType="toc" {...props} demoMode />
    <Container>
      <Row>
        <Col>
          <Button className="mr-2">Start Again</Button>
          <Button color="primary" tag={Link} to="/tutorials/quiz">Continue ...</Button>
        </Col>
      </Row>
    </Container>
  </div>
);

export default TutorialCourseTOC;
