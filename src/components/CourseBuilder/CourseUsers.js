import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';

import CourseUser from './CourseUser';
import InviteBox from './InviteBox';

/*
  manage the students, handle send invites and see their progress through then
  course
*/
/**
 * Adds two numbers together.
 * @param {shape} e event
 * @returns {JSX} the common builder
 */
export default class CourseUsers extends Component {
  /**
   * Adds two numbers together.
   * @param {shape} props property class
   * @returns {JSX} the common builder
   */
  constructor(props) {
    super(props);
    this.state = {
      students: [], modules: [],
    };
  }
  componentDidMount = () => {
    this.handleLoadStudents();
    this.handleLoadModules();
  }
  loadStudents = () => API.get('default', `/enrolment/${this.props.match.params.courseId}/students`)
    .then((students) => {
      this.setState({ students });
    })
    .catch((err) => {
      console.log('error getting students');
      console.log(err);
    })
  handleLoadStudents = () => this.loadStudents()
  handleLoadModules = () => {
    const { courseId } = this.props.match.params;
    API.get('default', '/modules', { queryStringParameters: { courseId } })
      .then((modules) => {
        this.setState({ modules });
      })
      .catch((err) => {
        console.log('error loading modules');
        console.log(err);
      });
  }
  handleRefreshStudents = () => {
    this.setState({ students: [] });
    this.loadStudents();
  }
  render = () => (
    <Container className="mt-2">
      <Row>
        <Col xs="12" md="1"><strong>No</strong></Col>
        <Col xs="12" md="5"><strong>Name</strong></Col>
        <Col xs="12" md="3"><strong>Progress</strong></Col>
        <Col xs="12" md="3"><strong>Status</strong></Col>
        <Col xs="12"><hr /></Col>
      </Row>
      <Row>
        <Col xs="12" className="text-right">
          <Button color="secondary" onClick={this.handleRefreshStudents}>
            <FontAwesomeIcon icon="redo" />
          </Button>
        </Col>
      </Row>
      {
        this.state.students.length === 0 ? (
          <Row>
            <Col>Nobody is enrolled in this course yet</Col>
          </Row>
        ) : this.state.students.map((student, i) => (
          <CourseUser
            key={student.userId}
            index={i}
            student={student}
            modules={this.state.modules}
            {...this.props}
          />
        ))
      }
      <InviteBox
        {...this.props}
        students={this.state.students}
        handleLoadStudents={this.handleLoadStudents}
      />
    </Container>
  )
}

CourseUsers.propTypes = {
  match: PropTypes.shape().isRequired,
};
