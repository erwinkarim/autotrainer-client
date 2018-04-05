import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { invokeApig } from '../../libs/awsLibs';
import config from '../../config';
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
      students: [],
    };
  }
  componentDidMount = () => {
    this.handleLoadStudents();
  }
  loadStudents = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    path: `/enrolment/${this.props.match.params.courseId}/students`,
  })
  handleLoadStudents = async () => {
    const handle = this;
    // load enrolled users
    try {
      const results = await handle.loadStudents();
      handle.setState({ students: results });
    } catch (e) {
      console.log('error getting students');
      console.log(e);
    }
  }
  handleRefreshStudents = async () => {
    this.setState({ students: [] });
    try {
      const result = await this.loadStudents();
      this.setState({ students: result });
    } catch (e) {
      console.log('error refreshing student list');
      console.log(e);
    }
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
            <FontAwesome name="redo" />
          </Button>
        </Col>
      </Row>
      {
        this.state.students.length === 0 ? (
          <Row>
            <Col>Nobody is enrolled in this course yet</Col>
          </Row>
        ) : this.state.students.map((student, i) =>
          <CourseUser key={student.userId} index={i} student={student} {...this.props} />)
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
