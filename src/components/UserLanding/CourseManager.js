import React, { Component } from 'react';
import { Row, Col, Card, CardTitle, CardBody, CardText, Button } from 'reactstrap';
import { HashLink as Link } from 'react-router-hash-link';
import Notice from '../../components/Notice';
import '../../containers/UserLanding.css';
import '../../containers/CertCheck.css';
import { invokeApig } from '../../libs/awsLibs';

/**
 * The Constructor
 * @param {json} e the props
 * @param {json} id the props
 * @returns {null} The sum of the two numbers.
 */
export default class CourseManager extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      courses: [], isLoading: false,
    };
  }
  componentDidMount = async () => {
    const handle = this;
    console.log('attempt to get user related courses');
    try {
      handle.setState({ isLoading: true });
      const results = await this.getCourses();
      handle.setState({ courses: results, isLoading: false });
    } catch (e) {
      console.log('error fetching user related courses');
      console.log(e);
    }
  }
  getCourses = () => invokeApig({
    path: '/courses/user',
  })
  deleteCourse = id => invokeApig({
    path: `/courses/${id}`,
    method: 'DELETE',
  })
  handleDelete = async (e) => {
    const handle = this;

    if (window.confirm('Really delete?')) {
      console.log('now should relaly delete them;');
      try {
        await this.deleteCourse(e.target.id);
        // TODO: remove from state instead of polling again from server
        const results = await this.getCourses();
        handle.setState({ courses: results });
      } catch (err) {
        console.log('Error trying to delete');
        console.log(err);
      }
    }
  }
  render = () => {
    if (this.state.isLoading) {
      return <Notice content="Loading courses ..." />;
    }

    return (
      <Row>
        <Col xs="12">
          <h3 id="managed">Your Managed Courses</h3>
          <hr />
          <p>Applicable if you have admin or publisher roles</p>
        </Col>
        <Col xs="12">
          { this.state.courses.length === 0 ?
              (<Notice className="mb-2" content={this.state.isLoading ? 'Loading courses ...' : 'No courses found.'} />) :
              (
            this.state.courses.map(e => (
              <Card key={e.courseId} className="mb-3">
                <CardBody>
                  <CardTitle>{e.name}</CardTitle>
                  { e.description.split('\n').map((p, key) => (<CardText key={parseInt(Math.random() * 1000, 10)} className={key === 0 ? 'lead' : ''}>{p}</CardText>)) }
                  <h4>Stats</h4>
                  <p>
                    Modules: (Published: {e.publishedModuleCount},
                    Total: {e.moduleCount}),
                    Quiz questions: (y)
                  </p>
                  <p>Price: RM{e.price}</p>
                  <Button className="mr-2 mb-2" color="info" tag={Link} to={`/courses/promo/${e.courseId}`}>Course Promo</Button>
                  <Button className="mr-2 mb-2" color="info" tag={Link} to={`/courses/toc/${e.courseId}`}>Table of Contents</Button>
                  <Button className="mr-2 mb-2" color="primary" tag={Link} to={`/user/builder/${e.courseId}`}>Manage</Button>
                  <Button className="mr-2 mb-2" color="danger" id={e.courseId} onClick={this.handleDelete}>Delete</Button>
                </CardBody>
              </Card>))
          )}
        </Col>
        <Col xs="12">
          <Link href="/" className="btn btn-primary" to="/courses/new">New Course</Link>
        </Col>
      </Row>
    );
  }
}
