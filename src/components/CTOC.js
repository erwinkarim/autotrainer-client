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
    handle.setState({ options: newOptions, loading: false });

    // get the modules
    try {
      const results = await this.getModules();
      handle.setState({ modules: results });
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
      return <Notice content="Loading courses ...." />;
    }

    if (this.state.modules.length === 0) {
      return (<Notice content="This course has zero modules" />);
    }

    let completionNotice = null;
    if (this.props.enrolment === null || this.props.enrolment === undefined) {
      completionNotice = null;
    } else if (this.props.enrolment.progress.length === this.state.modules.length) {
      completionNotice = (
        <Card body className="border border-success mb-2">
          <CardTitle className="mb-2">All modules attended</CardTitle>
        </Card>
      );
    }
    return (
      <div className="w-100">
        { completionNotice }
        <CardColumns>{
          this.state.modules.map((m, i) => {
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
        </CardColumns>
      </div>
    );
  }
}

CTOC.propTypes = {
  showLink: PropTypes.bool,
  enrolment: PropTypes.shape({
    progress: PropTypes.array,
  }),
  defaultOptions: PropTypes.shape({}),
  options: PropTypes.shape({}),
  course: PropTypes.shape({
    courseId: PropTypes.string,
  }).isRequired,
};

CTOC.defaultProps = {
  showLink: false,
  enrolment: { progress: [] },
  defaultOptions: { showLink: true, enrolment: null },
  options: {},
};
