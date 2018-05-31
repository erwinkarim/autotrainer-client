/*
  container to display course progress as a bookend of the couse
 */

import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import 'react-vertical-timeline-component/style.min.css';

/**
 * Course Progress
 * container to display course progress as a bookend of the couse
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
class CourseProgress extends Component {
  componentDidMount = () => {
    // should load up the progress here
  }
  render = () => {
    if (!this.props.module.modules) {
      return (<div>modules are loading ...</div>);
    }

    // show completed in time line
    let completedTimelineElm = null;
    if (this.props.enrolment.certId) {
      const certCompleteDate = new Date(this.props.enrolment.certIssued);
      const certCompleteDateCaption = certCompleteDate.toLocaleString('en-us', { day: 'numeric', month: 'long', year: 'numeric' });
      completedTimelineElm = (
        <VerticalTimelineElement
          date={certCompleteDateCaption}
          iconStyle={{ background: 'green', color: '#fff' }}
          icon={<FontAwesomeIcon icon="certificate" size="lg" />}
        >
          <h3 className="vertical-timeline-element-title">Completion Certificate</h3>
          <p>ID: {this.props.enrolment.certId}</p>
          <p><Button color="primary" tag={Link} to={`/verify_cert?certNo=${this.props.enrolment.certId}`}>View Certificate</Button></p>
        </VerticalTimelineElement>
      );
    }

    return (
      <Container className="text-left" style={{ backgroundColor: 'gainsboro' }}>
        <Row>
          <Col xs="12" md="8">
            <VerticalTimeline>
              {
                this.props.module.modules.map((e) => {
                  const completed = this.props.enrolment.progress.includes(e.moduleId);

                  const timelineIconStyle = completed ?
                    { background: 'rgb(33, 150, 243)', color: '#fff' } :
                    { background: 'red', color: '#fff' };
                  const timelineIcon = completed ? 'check' : 'minus';
                  const timelineCaption = completed ?
                    'Module Completed' :
                    <Button color="primary" tag={Link} to={`/courses/${e.moduleType}/${e.courseId}/${e.moduleId}`}>Complete Module</Button>;
                  return (
                    <VerticalTimelineElement
                      key={e.moduleId}
                      iconStyle={timelineIconStyle}
                      icon={<FontAwesomeIcon icon={timelineIcon} size="lg" />}
                    >
                      <h3 className="vertical-timeline-element-title">{e.title}</h3>
                      <p>{ timelineCaption }</p>
                    </VerticalTimelineElement>
                  );
                })
              }
              { completedTimelineElm }
            </VerticalTimeline>
          </Col>
        </Row>
      </Container>
    );
  }
}

CourseProgress.propTypes = {
  enrolment: PropTypes.shape({
    certId: PropTypes.string.isRequired,
    certIssued: PropTypes.number.isRequired,
    progress: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  module: PropTypes.shape({
    modules: PropTypes.arrayOf(PropTypes.shape).isRequired,
  }).isRequired,
};

CourseProgress.defaultProps = {
  enrolment: {},
};

export default CourseProgress;
