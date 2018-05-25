/*
  shows the menu at the botton of the course page, left and right
*/

import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { invokeApig } from '../libs/awsLibs';
import config from '../config';

/**
 * CourseBottomNav class
 * @param {json} e the props
 * @returns {null} The sum of the two numbers.
 */
export default class CourseBottomNav extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { modules: [] };
  }
  componentDidMount = async () => {
    try {
      const results = await this.getCourseModules();
      this.setState({ modules: results });
    } catch (e) {
      console.log('error getting courses');
      console.log(e);
    }
  }
  getCourseModules = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: '/modules',
    queryParams: { courseId: this.props.courseId },
  })
  render = () => {
    /*
      plan:
      1. load the modules and figure out which one is us
      2. detect previous and next module and show them
      3. if at edge, show end of course / begining of course tab
    */
    if (this.state.modules.length === 0) {
      return (<div>loading modules ...</div>);
    }

    // find current index then get the before/after module ids
    let currentIndex = -1;
    if (this.props.moduleType === 'toc') {
      currentIndex = -1;
    } else if (this.props.moduleType === 'progress') {
      currentIndex = this.state.modules.length;
    } else {
      currentIndex = this.state.modules.findIndex(e => e.moduleId === this.props.moduleId);
    }

    const prevModule = currentIndex === -1 || currentIndex === 0 ?
      null : this.state.modules[currentIndex - 1];
    let prevLink = `/courses/toc/${this.props.courseId}`;
    let prevLinkCaption = (<span><FontAwesome name="angle-left" /> Course Overview</span>);

    if (currentIndex === -1) {
      prevLink = '#';
      prevLinkCaption = (<span><FontAwesome name="home" /> Course Overview</span>);
    } else if (currentIndex === 0) {
      prevLink = `/courses/toc/${this.props.courseId}`;
      prevLinkCaption = (<span><FontAwesome name="angle-left" />{' Course Overview'}</span>);
    } else {
      prevLink = `/courses/${prevModule.moduleType}/${this.props.courseId}/${prevModule.moduleId}`;
      prevLinkCaption = <span><FontAwesome name="angle-left" />{` ${prevModule.title}`}</span>;
    }

    const nextModule = currentIndex === this.state.modules.length - 1 ?
      null : this.state.modules[currentIndex + 1];
    let nextLink = '#';
    let nextLinkCaption = 'Current Progress';
    if (currentIndex === this.state.modules.length - 1) {
      nextLink = `/courses/progress/${this.props.courseId}`;
      nextLinkCaption = <span>Course Progress <FontAwesome name="angle-right" /></span>;
    } else if (currentIndex === this.state.modules.length) {
      nextLink = '#';
      nextLinkCaption = <span>Course Progress <FontAwesome name="check-circle" /></span>;
    } else {
      nextLink = `/courses/${nextModule.moduleType}/${this.props.courseId}/${nextModule.moduleId}`;
      nextLinkCaption = <span>{`${nextModule.title} `}<FontAwesome name="angle-right" /></span>;
    }

    return (
      <Pagination size="lg">
        <PaginationItem className="w-100" disabled={currentIndex === -1}>
          <PaginationLink to={prevLink} tag={Link} href={prevLink} className="h-100">
            {prevLinkCaption}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className="w-100 text-right" disabled={currentIndex === this.state.modules.length}>
          <PaginationLink to={nextLink} tag={Link} href={nextLink} className="h-100">
            {nextLinkCaption}
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    );
  }
}

CourseBottomNav.propTypes = {
  courseId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,
};
