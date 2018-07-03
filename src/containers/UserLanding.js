import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Notice from '../components/Notice';
import './UserLanding.css';
import './CertCheck.css';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';
import EnrolledCourses from '../components/UserLanding/EnrolledCourses';
import InvitedCourses from '../components/UserLanding/InvitedCourses';
import CourseManager from '../components/UserLanding/CourseManager';

/*
class CourseHighLights extends Component {
  render(){
    return (
      <div className="col-12 mb-3">
        <h3 id="highlights">Course Highlights</h3>
        <hr />
        <p>This one not yet implemented</p>
        <CardDeck>{ Array.from( Array(3).keys() ).map( (e,i) => {
          return (<Card key={i}>
            <CardImg top src= 'https://placehold.it/128x128'/>
            <CardBody>
              <h4 className="display-5 text-center">{loremIpsum()}</h4>
              <CardText>{loremIpsum({count:randomInt(3,5), unit:'paragraphs'})}</CardText>
              <CardText>RM 34.99</CardText>
            </CardBody>
            <CardFooter className="text-center">
              <Button color="primary">Learn More</Button>
            </CardFooter>
          </Card>);
        }) }</CardDeck>
      </div>
    );
  }
}
*/

/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
export default class UserLanding extends Component {
  componentDidUpdate = async (prevProps) => {
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
    path: '/check',
    queryParams: { username: this.props.currentUser['cognito:username'] },
  })
  render = () => {
    const handle = this;

    if (this.props.isAuthenticating) {
      return <Notice content="Authenticating session ..." />;
    }

    if (!this.props.isAuthenticated) {
      return (<div>User is not authenticated</div>);
    }

    return (
      <Container className="text-left mt-2">
        <Helmet>
          <title>{`Welcome, ${handle.props.currentUser.name}`} - {config.site_name}</title>
        </Helmet>
        <Row>
          <div className="col-12">
            <p className="lead">
              <img height="32" src={handle.props.currentUser.picture} alt={handle.props.currentUser.name} className="rounded-circle mr-2" />
              Welcome, {handle.props.currentUser.name}
            </p>
          </div>
          <div className="col-12 col-md-8 mb-3">
            <ul>
              <li><Link href="/" to="#enrolled">Enrolled Courses</Link></li>
              <li><Link href="/" to="#invited">Invited Courses</Link></li>
              {
                /* only allow course to be managed by an admin for now */
                this.props.currentUser['cognito:groups'].includes('admin') ?
                  <li><Link href="/" to="#managed">Managed Courses</Link></li> :
                  null
              }
            </ul>
          </div>
        </Row>
        <EnrolledCourses {...this.props} />
        <InvitedCourses email={this.props.currentUser.email} />
        {
          /*
          -- to be implemented then you have more than 30 courses
          <CourseHighLights />
          */
        }
        {
          /* allow course to be managed by admins for now */
          this.props.currentUser['cognito:groups'].includes('admin') ? <CourseManager /> : null
        }
      </Container>
    );
  }
}

UserLanding.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape(),
  demoMode: PropTypes.bool,
};

UserLanding.defaultProps = {
  currentUser: {},
  demoMode: false,
};
