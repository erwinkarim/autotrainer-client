/*
  common builder component that will display the course or module layout
 */

import React from 'react';
import { Container, Row, Col, Card, CardText } from 'reactstrap';
import PropTypes from 'prop-types';
import CourseMenu from '../components/CourseMenu';
import CourseBuilder from '../containers/CourseBuilder';
import ModuleBuilder from '../containers/ModuleBuilder';

/**
 * Adds two numbers together.
 * @param {shape} props this.props
 * @returns {JSX} the common builder
 */
const Builder = (props) => {
  const { courseId, moduleId } = props.match.params;

  if (courseId) {
    return (
      <Container>
        <Row>
          <Col xs="12">
            <CourseMenu courseId={courseId} moduleId={moduleId} buildMode />
          </Col>
        </Row>
        { props.courseMode ? <CourseBuilder {...props} /> : <ModuleBuilder {...props} /> }
      </Container>
    );
  }

  return (
    <Container>
      <Card body>
        <CardText><h3>Loading ...</h3></CardText>
      </Card>
    </Container>
  );
};

export default Builder;

Builder.propTypes = {
  courseMode: PropTypes.bool,
  match: PropTypes.shape().isRequired,
};

Builder.defaultProps = {
  courseMode: false,
};
