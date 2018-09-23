import React, { Component } from 'react';
import { Container, Row, Col, CardColumns, Card, Form, FormGroup, Label, Input } from 'reactstrap';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { API, Auth } from 'aws-amplify';
import Notice from '../components/Notice';
import config from '../config';
import CourseCard from '../components/CourseCard';
// import { getUnauthCredentials, invokeApig } from '../libs/awsLibs';
import { userInfo } from '../libs/awsLibs';


/**
 * Courses
 * @param {int} e The first number.
 * @param {int} prevState The second number.
 * @param {int} prevProps The second number.
 * @returns {int} The sum of the two numbers.
 */
export default class Courses extends Component {
  /**
   * constructor
   * @param {int} props The second number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);

    this.state = {
      courses: [{}], enrolments: [], loading: true, show_mode: 'published_only',
    };
  }
  componentDidMount = async () => {
    // get currentuser
    userInfo()
      .then((res) => {
        this.setState({ currentUser: res });
      })
      .catch((err) => {
        console.log('getting user info error');
        console.log(err);
      });

    // attemp tto get courses, handle cases where credentials does not exists;
    this.loadCourses();

    // get enrolment if authenticated
    API
      .get('default', '/enrolment')
      .then((response) => { this.setState({ enrolments: response }); })
      .catch(() => {
        console.log('user is not authenticated');
      });
  }
  loadCourses = () => {
    console.log('attempt to get courses');
    API
      .get('default', '/courses', { queryStringParameters: { show_mode: this.state.show_mode } })
      .then((response) => {
        this.setState({ courses: response, loading: false });
      })
      .catch((err) => {
        console.log('error getting courses');
        console.log(err);
      });
  }
  handleAdminChange = async (e) => {
    const newPublishMode = e.target.value;
    await this.setState({ show_mode: newPublishMode });
    this.loadCourses();
  }
  render = () => {
    if (this.state.loading) {
      return <Notice content="Loading ..." />;
    }

    if (this.state.courses.length === 0) {
      return (<Notice content="Courses not found" />);
    }

    const isAdmin = this.state.currentUser && this.state.currentUser.isAdmin;
    const adminBar = isAdmin ? (
      <Col xs="12" className="mb-2">
        <Card body>
          <Form inline>
            <FormGroup>
              <Label className="mr-2">Admin options: Status mode</Label>
              <Input type="select" value={this.state.show_mode} onChange={this.handleAdminChange}>
                <option value="all">Show all courses</option>
                <option value="published_only">Show published only</option>
              </Input>
            </FormGroup>
          </Form>
        </Card>
      </Col>
    ) : null;
    const demoCourseCard = this.props.demoMode ? (
      <CourseCard
        className="course-demo-card"
        enrolments={this.state.enrolments}
        course={{
          name: 'Demo title',
          description: 'A demo description for a demo course.',
          tagline: 'A demo course to rule them all',
        }}
        {...this.props}
      />
    ) : null;

    return (
      <Container className="mt-2 courses-title">
        <Helmet>
          <title>Courses - {config.site_name}</title>
        </Helmet>
        <Row>
          { adminBar }
          <div className="col-12">
            <CardColumns>
              { demoCourseCard }
              {
                this.state.courses.map(c => (<CourseCard
                  key={c.courseId}
                  course={c}
                  enrolments={this.state.enrolments}
                  {...this.props}
                />
                ))
              }
            </CardColumns>
          </div>
        </Row>
      </Container>
    );
  }
}

Courses.propTypes = {
  demoMode: PropTypes.bool,
};

Courses.defaultProps = {
  demoMode: false,
};
