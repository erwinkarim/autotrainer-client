/*
  Course side bar showing, overview, course contents, etc
*/

import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, Collapse } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';

import './CourseMenu.css';

/**
 * The Constructor
 * @param {json} e the props
 * @returns {null} The sum of the two numbers.
 */
export default class CourseMenu extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      collapse: true, courseInfo: null, modules: [], loaded: false,
    };
  }
  componentDidMount = async () => {
    const { courseId, buildMode } = this.props;
    this.setState({ loaded: false });

    // load the course info
    API.get('default', `/courses/${courseId}`)
      .then((response) => {
        this.setState({ courseInfo: response, loaded: true });
      })
      .catch((err) => {
        console.log('error getting course info');
        console.log(err);
      });

    // load the course modules based on courseId
    API.get('default', '/modules', { queryStringParameters: { courseId, buildMode } })
      .then((response) => {
        this.setState({ modules: response.sort((a, b) => a.order > b.order) });
      })
      .catch((err) => {
        console.log('error getting modules');
        console.log(err);
      });
  }
  toggleNavbar = () => { this.setState({ collapse: !this.state.collapse }); }
  handleClick = (e) => {
    // should close the navbar and push to history
    e.preventDefault();
    const url = new URL(e.target.href);

    this.setState({ collapse: true });
    this.props.history.push(url.pathname);
  }
  render = () => {
    if (!this.state.loaded) {
      return (<Navbar><NavbarBrand> Loading ... </NavbarBrand></Navbar>);
    }

    const {
      courseId, moduleId, enrolment, buildMode,
    } = this.props;
    const courseHomePath = this.props.buildMode ?
      `/user/builder/${courseId}` :
      `/courses/toc/${courseId}`;

    // configure showOneByOne option;
    let showOneByOne = false;
    if (this.state.courseInfo.courseOptions) {
      if (this.state.courseInfo.courseOptions.showOneByOne) {
        showOneByOne = this.state.courseInfo.courseOptions.showOneByOne;
      }
    }

    let availableModules = this.state.modules;
    if (showOneByOne && !buildMode) {
      availableModules = this.state.modules.filter(e => enrolment.progress.includes(e.moduleId));
      const firstUnread = this.state.modules.filter(e =>
        !enrolment.progress.includes(e.moduleId))[0];
      if (firstUnread) {
        availableModules.push(firstUnread);
      }
    }

    return (
      <Navbar className="px-0 course-menu">
        <NavbarToggler onClick={this.toggleNavbar} className="">
          <FontAwesomeIcon icon="bars" className="course-menu-hamburger" style={{ zIndex: 1000 }} />
        </NavbarToggler>
        <NavbarBrand className="mr-auto brand-text">
          { this.props.buildMode ? 'Building ' : '' }
          { this.state.courseInfo.name }
        </NavbarBrand>
        <Collapse navbar isOpen={!this.state.collapse} className="">
          <Nav navbar className="text-left">
            <NavItem>
              <NavLink tag={Link} to={courseHomePath} onClick={this.handleClick} className="lead" style={{ fontSize: 'xx-large' }}>
                Course {this.props.buildMode ? 'Builder' : 'Overview'}
              </NavLink>
            </NavItem>
            {
              availableModules.map((m, i) => {
                const path = this.props.buildMode ?
                  `/user/builder/${courseId}/${m.moduleId}` :
                  `/courses/${m.moduleType}/${courseId}/${m.moduleId}`;
                return (
                  <NavItem key={m.moduleId}>
                    <NavLink tag={Link} to={path} onClick={this.handleClick} className={m.publish_status === 'published' ? '' : 'text-muted'}>
                      { m.moduleId === moduleId ? <i>{m.title}</i> : m.title }
                    </NavLink>
                  </NavItem>
                );
              })
            }
            {
              this.props.buildMode ? null : (
                <NavItem>
                  <NavLink tag={Link} to={`/courses/progress/${courseId}`} onClick={this.handleClick} className="lead">
                    Course Progress
                  </NavLink>
                </NavItem>
              )
            }
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

CourseMenu.propTypes = {
  courseId: PropTypes.string,
  moduleId: PropTypes.string,
  buildMode: PropTypes.bool,
  history: PropTypes.shape().isRequired,
  enrolment: PropTypes.shape(),
};

CourseMenu.defaultProps = {
  courseId: '4c082890-e510-11e7-bd48-59001745cb8e',
  moduleId: '0e1e3b80-ff48-11e7-b64f-c32e5e53678a',
  buildMode: false,
  enrolment: null,
};
