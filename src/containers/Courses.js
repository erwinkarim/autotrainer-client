import React, { Component } from 'react';
import { Container, Row, Col, CardColumns, Card, Form, FormGroup, Label, Input } from 'reactstrap';
import Helmet from 'react-helmet';
import AWS from 'aws-sdk';
import PropTypes from 'prop-types';
import { invokeApig, getUnauthCredentials } from '../libs/awsLibs';
import Notice from '../components/Notice';
import config from '../config';
import CourseCard from '../components/CourseCard';


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
    // attemp tto get courses, handle cases where credentials does not exists;
    try {
      if (AWS.config.credentials === null) {
        await getUnauthCredentials();
      }

      const results = await this.getCourses();
      this.setState({ courses: results, loading: false });
    } catch (e) {
      console.log(`${Date.now()}: Error getting courses`);
      console.log(e);
    }

    // attempt to get enrolment
    try {
      if (this.props.currentUser === null) {
        return;
      }

      const enrolmentResults = await this.getEnrolment();
      this.setState({ enrolments: enrolmentResults });
    } catch (e) {
      console.log('Error getting enrolment');
      console.log(e);
    }
  }
  getEnrolment = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    path: '/enrolment',
  })
  getCourses = () => invokeApig({
    path: '/courses',
    queryParams: { show_mode: this.state.show_mode },
  })
  handleAdminChange = async (e) => {
    const newPublishMode = e.target.value;
    await this.setState({ show_mode: newPublishMode });

    // reload the course w/ new option
    try {
      const results = await this.getCourses();
      this.setState({ courses: results });
    } catch (err) {
      console.log('error reloading courses');
      console.error(err);
    }
  }
  render = () => {
    if (this.state.loading) {
      return <Notice content="Loading ..." />;
    }

    if (this.state.courses.length === 0) {
      return (<Notice content="Courses not found" />);
    }

    const isAdmin = this.props.currentUser === null ? false : this.props.currentUser['cognito:groups'].includes('admin');
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
