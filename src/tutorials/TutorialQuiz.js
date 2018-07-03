import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Module from '../containers/Module';
import config from '../config';

const TutorialUserLanding = props => (
  <div>
    <Container className="my-2">
      <Row>
        <Col>
          <h2>Step 4 of the tutorial</h2>
          <p>perhaps some content about quiz page ??</p>
        </Col>
      </Row>
    </Container>
    <Module courseId={config.tutorial.course} moduleId={config.tutorial.quiz} moduleType="quiz" {...props} demoMode />
    <Container>
      <Row>
        <Col>
          <Button className="mr-2">Start Again</Button>
          <Button color="primary" tag={Link} to="/tutorials/doc">Continue ...</Button>
        </Col>
      </Row>
    </Container>
  </div>
);

export default TutorialUserLanding;
