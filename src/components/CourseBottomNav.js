/*
  shows the menu at the botton of the course page, left and right
*/

import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Link } from 'react-router-dom';
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
      this.setState({ modules: results.sort((a, b) => a.order > b.order) });
    } catch (e) {
      console.log('error getting courses');
      console.log(e);
    }
  }
  getCourseModules = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: '/modules',
    queryParams: { courseId: this.props.courseId, publish_status: this.props.buildMode ? 'all' : 'published' },
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
    const currentIndex = this.props.moduleId === null ?
      -1 :
      this.state.modules.findIndex(e => e.moduleId === this.props.moduleId);
    console.log('currentIndex', currentIndex);

    const prevModule = this.props.currentIndex === -1 || this.props.currentIndex === 0 ?
      null : this.state.modules[currentIndex - 1];
    console.log('prevModule', prevModule);

    const prevLink = prevModule === null || prevModule === undefined ?
      `/courses/toc/${this.props.courseId}` :
      `/courses/${prevModule.moduleType}/${this.props.courseId}/${prevModule.moduleId}`;

    const nextModule = this.props.currentIndex === this.state.modules.length - 1 ?
      null : this.state.modules[currentIndex + 1];

    const nextLink = nextModule === null || nextModule === undefined ?
      '#' : `/courses/${nextModule.moduleType}/${this.props.courseId}/${nextModule.moduleId}`;

    return (
      <Pagination size="lg">
        <PaginationItem className="w-100">
          <PaginationLink previous to={prevLink} tag={Link} href={prevLink} />
        </PaginationItem>
        <PaginationItem className="w-100 text-right">
          <PaginationLink next to={nextLink} tag={Link} href={nextLink} />
        </PaginationItem>
      </Pagination>
    );
  }
}
