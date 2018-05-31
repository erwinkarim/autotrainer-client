/*
  container to display course progress as a bookend of the couse
 */

import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
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

    return (
      <Container className="text-left" style={{ backgroundColor: 'grey' }}>
        <Row>
          <Col xs="12" md="8">
            <VerticalTimeline>{
              this.props.module.modules.map(e => (
                <VerticalTimelineElement
                  key={e.moduleId}
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  icon={<FontAwesome name="check" />}
                >
                  <h3 className="vertical-timeline-element-title">{e.title}</h3>
                  <p>{ this.props.enrolment.progress.includes(e.moduleId) ? 'Module Completed' : ''}</p>
                </VerticalTimelineElement>
              ))
            }
              {
                this.props.enrolment.certId ? (
                  <VerticalTimelineElement
                    date={this.props.enrolment.certIssued}
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    icon={<FontAwesome name="certificate" />}
                  >
                    <h3 className="vertical-timeline-element-title">Completion Certificate</h3>
                    <p>ID: {this.props.enrolment.certId}</p>
                    <p>Issued: {(this.props.enrolment.certIssued)}</p>
                    <p><Button color="primary" tag={Link} to={`/verify_cert?certNo=${this.props.enrolment.certId}`}>View Certificate</Button></p>
                  </VerticalTimelineElement>
                ) : null
              }
            </VerticalTimeline>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CourseProgress;
