import React, { Component } from 'react';
import { Container, Row, Col, CardColumns, Card, Form, FormGroup, Label, Input } from 'reactstrap';
import Helmet from 'react-helmet';
import AWS from 'aws-sdk';
import { invokeApig } from '../libs/awsLibs';
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
    /**
     * sometimes issues getting courses due to authentication issues.
     * maybe move to componentReceiveProps
     */
    try {
      const results = await this.getCourses();
      const enrolmentResults = await this.getEnrolment();
      this.setState({ courses: results, enrolments: enrolmentResults, loading: false });
    } catch (e) {
      console.log(`${Date.now()}: Error getting courses`);
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

    if (!this.props.isAuthenticated) {
      return (<div>User is not authenticated</div>);
    }

    if (AWS.config.credentials === null) {
      return (<div>Credentials are not set</div>);
    }

    if (this.state.courses.length === 0) {
      return (<Notice content="Courses not found" />);
    }

    const isAdmin = this.props.currentUser['cognito:groups'].includes('admin');

    return (
      <Container className="mt-2">
        <Helmet>
          <title>Courses - {config.site_name}</title>
        </Helmet>
        <Row>
          {
            isAdmin ?
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
            : null
          }
          <div className="col-12">
            <CardColumns>
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
