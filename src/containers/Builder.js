/*
  common builder component that will display the course or module layout
 */

import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { withAuthenticator } from 'aws-amplify-react';

import { userInfo } from '../libs/awsLibs';
import CourseMenu from '../components/CourseMenu';
import asyncComponent from '../components/AsyncComponent';
// import CourseBuilder from '../containers/CourseBuilder';
import ModuleBuilder from '../containers/ModuleBuilder';
import Notice from '../components/Notice';

const CourseBuilder = asyncComponent(() => import('../containers/CourseBuilder'));
// const ModuleBuilder = asyncComponent(() => import('../containers/ModuleBuilder'));

/**
 * Adds two numbers together.
 * @param {shape} props this.props
 * @returns {JSX} the common builder
 */
class Builder extends Component {
  /**
   * Adds two numbers together.
   * @param {shape} props this.props
   * @returns {JSX} the common builder
   */
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
    };
  }
  componentDidMount = () => {
    userInfo()
      .then((res) => {
        this.setState({ currentUser: res });
      });
  }
  render = () => {
    const { courseId, moduleId } = this.props.match.params;
    const { courseMode } = this.props;
    const { currentUser } = this.state;

    // sanity checks
    if (!currentUser) {
      return <Notice content="Unauthenticated" />;
    } else if (!currentUser.isAdmin) {
      return <Notice content="Unauthorized" />;
    }

    return (
      <Container>
        <Row>
          <Col xs="12">
            <CourseMenu courseId={courseId} moduleId={moduleId} {...this.props} buildMode />
          </Col>
        </Row>
        {
          courseMode ?
            <CourseBuilder {...this.props} {...this.state} /> :
            <ModuleBuilder {...this.props} {...this.state} />
        }
      </Container>
    );
  }
}

export default withAuthenticator(Builder);

Builder.propTypes = {
  courseMode: PropTypes.bool,
  match: PropTypes.shape().isRequired,
};

Builder.defaultProps = {
  courseMode: false,
};
