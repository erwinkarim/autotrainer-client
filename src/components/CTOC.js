/*
  component to show course TOC. not the be confused w/ a container that shows the course TOC page

  required props.course
*/
import React, { Component } from 'react';
import { CardColumns, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Notice from './Notice';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';

/**
 * shows course table of content
 * @param {int} num1 The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */
export default class CTOC extends Component {
  /**
   * constructor
   * @param {int} props properties.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);

    this.state = { modules: [], loading: true };
  }
  componentDidMount = async () => {
    const handle = this;

    // update the options
    const newOptions = Object.assign(this.props.defaultOptions, this.props.options);
    handle.setState({ options: newOptions });

    // get the modules
    try {
      const results = await this.getModules();
      handle.setState({ modules: results, loading: false });
    } catch (e) {
      console.log('error getting modules');
      console.log(e);
    }
  }
  getModules = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: '/modules',
    queryParams: { courseId: this.props.course.courseId },
  })
  render = () => {
    if (this.state.loading) {
      return <Notice content="Loading table of contents ...." />;
    }

    if (this.state.modules.length === 0) {
      return (<Notice content="This course has zero modules" />);
    }

    // setting up const
    const {
      course, enrolment, promo, className,
    } = this.props;
    const enrolmentProgress = enrolment === null || enrolment === undefined ?
      0 : enrolment.progress.length;
    let showOneByOne = false;
    if (course.courseOptions) {
      if (course.courseOptions.showOneByOne) {
        showOneByOne = course.courseOptions.showOneByOne;
      }
    }

    // setup completionNotice
    let completionNotice = null;
    if (enrolment === null || enrolment === undefined) {
      completionNotice = null;
    } else if (enrolmentProgress === this.state.modules.length) {
      completionNotice = (
        <Card body className="border border-success mb-2">
          <CardTitle>All modules attended</CardTitle>
        </Card>
      );
    }

    // setup one by one notice
    let oneByOneNotice = null;
    if (
      (showOneByOne) && (
        this.props.enrolment === null || this.props.enrolment === undefined ||
        this.props.enrolment.progress.length < this.state.modules.length
      ) && !promo
    ) {
      oneByOneNotice = (
        <Card body className="mb-2">
          <CardText>
            There are {this.state.modules.length} published modules.
            You will see them as you progress through the course
          </CardText>
        </Card>
      );
    }

    // lsit modules based on course.courseOptions.showOneByOne value
    // if showOneByOne = show read module and the next unread module only
    let availableModules = this.state.modules;
    if (showOneByOne && !promo) {
      availableModules = this.state.modules.filter(e => enrolment.progress.includes(e.moduleId));
      const firstUnread = this.state.modules.filter(e =>
        !enrolment.progress.includes(e.moduleId))[0];
      if (firstUnread) {
        availableModules.push(firstUnread);
      }
    }

    return (
      <div className={`w-100 ${className}`}>
        { completionNotice }
        { oneByOneNotice }
        <CardColumns>
          {
            availableModules.map((m, i) => {
              const attended =
                this.props.enrolment === null || this.props.enrolment === undefined ?
                  false :
                  this.props.enrolment.progress.includes(m.moduleId);
              return (
                <Card key={m.moduleId} className={`${attended ? 'border border-success' : null}`}>
                  <CardBody>
                    <CardTitle>
                      { this.props.showLink ? (
                        <Link href="/" to={`/courses/${m.moduleType}/${m.courseId}/${m.moduleId}`}>{ i + 1 }: {m.title}</Link>
                      ) : (
                        <span>{i + 1}: {m.title}</span>
                      )}
                    </CardTitle>
                    <CardText>{m.description}</CardText>
                    { attended ? <CardText className="text-success">Module attended</CardText> : null }
                  </CardBody>
                </Card>
              );
            })
          }
          {
            promo && enrolment ? (
              <Card body>
                <CardText>Click <Link to={`/courses/toc/${course.courseId}`} href={`/courses/toc/${course.courseId}`}>here</Link> to begin the course</CardText>
              </Card>
            ) : null
          }
        </CardColumns>
      </div>
    );
  }
}

CTOC.propTypes = {
  showLink: PropTypes.bool,
  enrolment: PropTypes.shape({
    progress: PropTypes.array,
  }).isRequired,
  defaultOptions: PropTypes.shape({}),
  options: PropTypes.shape({}),
  course: PropTypes.shape({
    courseId: PropTypes.string,
  }).isRequired,
  promo: PropTypes.bool,
};

CTOC.defaultProps = {
  showLink: false,
  defaultOptions: { showLink: true, enrolment: null },
  options: {},
  promo: false,
};
