/*
  container to display course progress as a bookend of the couse
 */

import React from 'react';
import { Container, Row, Col } from 'reactstrap';

/**
 * Course Progress
 * container to display course progress as a bookend of the couse
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
const CourseProgress = () => (
  <Container className="text-left">
    <Row>
      <Col xs="12" md="8">
        <p>Show progress here</p>
      </Col>
    </Row>
  </Container>
);

export default CourseProgress;
