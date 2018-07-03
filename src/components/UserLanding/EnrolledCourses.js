import React, { Component } from 'react';
import {
  Row, CardColumns, Card, CardTitle,
  CardBody, CardText, Button, Modal, ModalBody, ModalFooter,
} from 'reactstrap';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';
import Notice from '../../components/Notice';
import '../../containers/UserLanding.css';
import '../../containers/CertCheck.css';
import config from '../../config';
import { invokeApig } from '../../libs/awsLibs';

/**
 * The Constructor
 * @param {json} e the props
 * @returns {null} The sum of the two numbers.
 */
export default class EnrolledCourses extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      courses: [], isLoading: false, modal: false, certContents: {},
    };
  }
  componentDidMount = async () => {
    console.log('attempt to get enrolled courses');
    try {
      this.setState({ isLoading: true });
      const results = await this.loadEnrolledCourses();
      this.setState({ courses: results, isLoading: false });
    } catch (e) {
      console.log('error getting enrolled courses');
      console.log(e);
    }
  }
  loadEnrolledCourses = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    path: '/enrolment',
  })
  toggleModal = (e) => {
    this.setState({ modal: !this.state.modal });

    if (!this.state.modal) {
      // should update cert info
      const courseIndex = e.target.dataset.course;
      this.setState({
        certContents: this.state.courses[courseIndex],
      });
    }
  }
  render = () => {
    if (this.state.isLoading) {
      return <Notice content="Checking enrolled courses ..." />;
    }

    const enrolledCourses = this.state.courses.length === 0 ? (
      <div>You haven&amp;t enrolled in any courses yet.</div>
    ) : (
      <CardColumns>
        {
          this.props.demoMode ? (
            <Card body className="border border-success">
              <CardTitle className="enrolled-courses-title">
                <a href="/">Demo Title</a>
              </CardTitle>
              <CardText><strong>Progress</strong></CardText>
              <CardText>
                5 of 5 modules attended
              </CardText>
              <CardText className="text-success enrolled-courses-cert">
                Course Completed <Button color="info" size="small">View Cert</Button>
              </CardText>
            </Card>
          ) : null
        }
        {
          this.state.courses.map((c, i) => {
          const courseComplete = c.progress.length >= c.publishedModuleCount;
          return (
            <Card key={c.courseId} className={`${courseComplete ? 'border border-success' : ''}`}>
              <CardBody>
                <CardTitle><Link href="/" to={`/courses/toc/${c.courseId}`}>{c.name}</Link></CardTitle>
                <CardText><strong>Progress</strong></CardText>
                <CardText>
                  {c.progress.length} of {c.publishedModuleCount} modules attended
                </CardText>
                {
                  courseComplete ?
                    <CardText className="text-success">
                      Course Completed <Button color="info" size="small" onClick={this.toggleModal} data-course={i}>View Cert</Button>
                    </CardText> : null
                }
              </CardBody>
            </Card>);
          })
        }
      </CardColumns>
    );

    const certDate = new Date(this.state.certContents.certIssued);
    const courseName = this.state.certContents.name ?
      this.state.certContents.name.toUpperCase() : null;
    return (
      <Row>
        <div className="col-12">
          <h3><span className="enrolled-courses-main-title">Enrolled Courses</span></h3>
          <hr />
          { enrolledCourses }
          <Modal isOpen={this.state.modal} onOpened={this.handleModalOpen} size="lg" >
            <ModalBody className="cert text-center">
              <h2>CERTIFICATE OF COMPLETION</h2>
              <p className="cert-text">This certifies that</p>
              <p>{ this.props.currentUser.name }</p>
              <p className="cert-text">has completed the short course entitled</p>
              <p><strong>{ courseName }</strong></p>
              <p><img className="cert-logo" src="/logos/learn.part1.png" alt="learn@AP" /></p>
              <div className="w-100 d-flex justify-content-between  pb-4">
                <span className="cert-text col-4 pt-4">
                  <Link href="/" to={`/verify_cert?certNo=${this.state.certContents.certId}`}>
                    <small>{this.state.certContents.certId}</small>
                  </Link>
                </span>
                <span className="col-4" />
                <span className="cert-text col-4 pt-4">{`${certDate.toLocaleString('en-us', { day: 'numeric', month: 'long', year: 'numeric' })}`}</span>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.toggleModal}>OK</Button>
            </ModalFooter>
          </Modal>
          <p><Button color="primary" to="/courses" tag={Link}>Explore Courses</Button></p>
        </div>
      </Row>
    );
  }
}

EnrolledCourses.propTypes = {
  currentUser: PropTypes.shape().isRequired,
};
