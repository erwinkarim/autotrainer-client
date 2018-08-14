import React, { Component } from 'react';
import { Container, Row, Col, Alert, Navbar, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { invokeApig } from '../libs/awsLibs';
import EnrolledCourses from '../components/UserLanding/EnrolledCourses';
import InvitedCourses from '../components/UserLanding/InvitedCourses';
import CourseManager from '../components/UserLanding/CourseManager';
import config from '../config';

/**
 * User Landing Component
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
class UserLanding extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'enrolled',
    };
  }
  componentDidMount = async () => {
    // check if need for auto enrolment
    const enrolCourse = window.localStorage.getItem('enrol_course');
    if (enrolCourse) {
      try {
        window.localStorage.removeItem('enrol_course');
        this.autoEnrolCourse(enrolCourse);
      } catch (e) {
        console.log('problem trying to enrol course');
        console.log(e);
      }
    }

    // check for login redirects
    const newLocation = window.localStorage.getItem('login_redirect');

    if (newLocation) {
      window.localStorage.removeItem('login_redirect');
      this.props.history.push(newLocation);
    }
  }
  componentDidUpdate = async (prevProps) => {
    console.log('componentDidUpdate');
    if (prevProps.currentUser !== this.props.currentUser) {
      try {
        await this.checkIdent();
      } catch (e) {
        console.log('error checking username');
        console.log(e);
      }
    }
  }
  checkIdent = () => invokeApig({
    endpoint: config.apiGateway.IDENT_URL,
    method: 'POST',
    path: '/ident/check',
    queryParams: { username: this.props.currentUser['cognito:username'] },
  })
  autoEnrolCourse = courseId => invokeApig({
    method: 'POST',
    path: '/enrolment',
    body: { courseId },
  })
  toggleTab = (tab) => {
    this.setState({ activeTab: tab });
  }
  render = () => {
    const { currentUser, isAuthenticated, isAuthenticating } = this.props;

    if (isAuthenticating) {
      return (<div>Checking auth ...</div>);
    }

    if (!isAuthenticated) {
      return (<div>User not authenticated</div>);
    }

    if (!currentUser) {
      return (<div>User not detected</div>);
    }

    return (
      <Container className="mt-2">
        <Helmet>
          <title className="user-landing-welcome">{`Welcome, ${currentUser.name}`} - {config.site_name}</title>
        </Helmet>
        <Row>
          <Col>
            <p className="lead">
              <img height="32" src={currentUser.picture} alt={currentUser.name} className="rounded-circle mr-2" />
              Welcome, {currentUser.name}
            </p>
          </Col>
        </Row>
        {
          this.props.demoMode ? null : (
            <Row>
              <Col>
                <Alert color="info">To make the most out of learn@AP, please head out to the <Link href="/" to="/tutorials">tutorials</Link></Alert>
              </Col>
            </Row>
          )
        }
        <Row>
          <Col xs="12" md="4" className="mb-2">
            <Navbar color="light" light>
              <Nav navbar className="d-flex flex-row flex-md-column justify-content-end justify-content-md-center">
                <NavItem className="mr-2">
                  <NavLink
                    href="#"
                    active={this.state.activeTab === 'enrolled'}
                    onClick={() => this.toggleTab('enrolled')}
                  >
                    Enrolled
                  </NavLink>
                </NavItem>
                <NavItem className="mr-2">
                  <NavLink href="#" active={this.state.activeTab === 'invited'} onClick={() => this.toggleTab('invited')}>Invited</NavLink>
                </NavItem>
                {
                  currentUser['cognito:groups'].includes('admin') ? (
                    <NavItem>
                      <NavLink href="#" active={this.state.activeTab === 'managed'} onClick={() => this.toggleTab('managed')}>Managed</NavLink>
                    </NavItem>
                  ) : null
                }
              </Nav>
            </Navbar>
          </Col>
          <Col md="8" className="mb-2">
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="enrolled">
                <EnrolledCourses {...this.props} />
              </TabPane>
              <TabPane tabId="invited">
                <InvitedCourses email={currentUser.email} {...this.props} />
              </TabPane>
              {
                currentUser['cognito:groups'].includes('admin') ? (
                  <TabPane tabId="managed">
                    <CourseManager />
                  </TabPane>
                ) : null
              }
            </TabContent>
          </Col>
        </Row>
      </Container>
    );
  }
}

UserLanding.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape(),
  demoMode: PropTypes.bool,
  history: PropTypes.shape().isRequired,
};

UserLanding.defaultProps = {
  currentUser: {},
  demoMode: false,
};

export default UserLanding;
