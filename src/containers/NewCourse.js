import React, { Component } from 'react';
import {
  Container, Row, Form, FormGroup, Input, InputGroup, InputGroupAddon,
  Breadcrumb, BreadcrumbItem, Button, InputGroupText,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import toTitleCase from 'titlecase';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
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
export default class NewCourse extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { title: '', description: '' };
  }
  handleChange = (e) => {
    this.setState({ [e.target.id]: (e.target.id === 'title' ? toTitleCase(e.target.value) : e.target.value) });
  }
  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('attempt to createCourse');
      const result = await this.createCourse({
        name: this.state.title,
        description: this.state.description,
      });
      this.props.history.push(`/user/builder/${result.courseId}`);
    } catch (err) {
      console.log('error creating course');
      console.log(err);
    }
  }
  createCourse = course => invokeApig({
    path: '/courses',
    method: 'POST',
    body: course,
  })
  validateForm = () => (this.state.title.length > 0 && this.state.description.length > 0)
  render = () => {
    if (!this.props.isAuthenticated) {
      return (<Notice title="Unauthorized" content="User is not authenticated" />);
    }

    return (
      <Container className="mt-2">
        <Helmet>
          <title>New course - {config.site_name}</title>
        </Helmet>
        <Breadcrumb>
          <BreadcrumbItem tag={Link} to="/">Home</BreadcrumbItem>
          <BreadcrumbItem tag={Link} to="/welcome">{this.props.currentUser.name}</BreadcrumbItem>
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
  isAuthenticated: PropTypes.bool.isRequired,
  history: PropTypes.shape().isRequired,
};

NewCourse.defaultProps = {
  currentUser: {},
};
