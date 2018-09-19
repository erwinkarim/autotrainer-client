import React, { Component } from 'react';
import {
  Container, Row, Form, FormGroup, Input, InputGroup, InputGroupAddon,
  Breadcrumb, BreadcrumbItem, Button, InputGroupText,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import toTitleCase from 'titlecase';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Auth, API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { decode } from 'jsonwebtoken';

import './NewCourse.css';
import { invokeApig } from '../libs/awsLibs';
import Notice from '../components/Notice';
import config from '../config';

/**
 * The Constructor
 * @param {json} e the props
 * @param {json} course the props
 * @returns {null} The sum of the two numbers.
 */
class NewCourse extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      title: '', description: '', currentUser: null, userInfo: null,
    };
  }
  componentDidMount = () => {
    // get current User session
    Auth.currentSession()
      .then((res) => {
        // cognito user
        // Cache.setItem('userinfo', res.idToken.payload);
        this.setState({ currentUser: res.idToken.payload });
      })
      .catch(() => {
        // google user: store userinfo from jwt token
        Auth.currentCredentials()
          .then((cred) => {
            const result = decode(cred.webIdentityCredentials.params.Logins['accounts.google.com']);
            // console.log('decode result', result);
            this.setState({ currentUser: result });

            // send identity id to be checked / registered
            API.post('default', '/ident/check', {
              body: {
                username: `Google_${result.sub}`,
              },
            });
          })
          .catch((err) => {
            console.log('error getting user credentials');
            console.log(err);
          });
      });
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (!prevState.currentUser && this.state.currentUser.name !== '') {
      console.log('should get user info when user updated from empty');
      const { currentUser } = this.state;
      const username = currentUser.iss === 'accounts.google.com' ? `Google_${currentUser.sub}` : currentUser.sub;

      API.post('default', '/ident/user_info', { body: { username } })
        .then((res) => {
          this.setState({ userInfo: res });
        })
        .catch((err) => {
          console.log('error getting userinfo');
          console.log(err);
        });
    } // if
  }
  handleChange = (e) => {
    this.setState({ [e.target.id]: (e.target.id === 'title' ? toTitleCase(e.target.value) : e.target.value) });
  }
  handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description } = this.state;

    API.post('default', '/courses', { body: { name: title, description } })
      .then((res) => {
        this.props.history.push(`/user/builder/${res.courseId}`);
      })
      .catch((err) => {
        console.log('error creating course');
        console.log(err);
      });
  }
  createCourse = course => invokeApig({
    path: '/courses',
    method: 'POST',
    body: course,
  })
  validateForm = () => (this.state.title.length > 0 && this.state.description.length > 0)
  render = () => {
    const { currentUser, userInfo } = this.state;

    let adminUser = false;
    if (userInfo) {
      adminUser = userInfo.Groups.reduce((a, v) => a || v.GroupName === 'admin', false);
    }

    if (!adminUser) {
      return <Notice title="Unauthorized" content="You are not an admin user" />;
    }

    return (
      <Container className="mt-2">
        <Helmet>
          <title>New course - {config.site_name}</title>
        </Helmet>
        <Breadcrumb>
          <BreadcrumbItem tag={Link} to="/">Home</BreadcrumbItem>
          <BreadcrumbItem tag={Link} to="/welcome">{currentUser.name || currentUser.email }</BreadcrumbItem>
          <BreadcrumbItem active>New Course</BreadcrumbItem>
        </Breadcrumb>
        <Row className="text-left">
          <div className="col-12 col-md-8">
            <h3>
              New Course
              <small className="text-muted"> Enter details to kick things off.</small>
            </h3>
          </div>
          <div className="col-12 col-md-8">
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <InputGroup>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Course Title. Should be less than 140 characters"
                    maxLength="140"
                    value={this.state.title}
                    onChange={this.handleChange}
                  />
                  <InputGroupAddon addonType="append"><InputGroupText>{140 - this.state.title.length}</InputGroupText></InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Input
                  id="description"
                  type="textarea"
                  rows="20"
                  placeholder="Description about the course..."
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <Button color="primary" disabled={!this.validateForm()}>Create Course</Button>
            </Form>
          </div>
        </Row>
      </Container>
    );
  }
}

NewCourse.propTypes = {
  currentUser: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
};

NewCourse.defaultProps = {
  currentUser: {},
};

export default withAuthenticator(NewCourse);
