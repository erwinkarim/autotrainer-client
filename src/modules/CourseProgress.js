/*
  container to display course progress as a bookend of the couse
 */

import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import FontAwesome from 'react-fontawesome';
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
  render = () => (
    <Container className="text-left" style={{ backgroundColor: 'grey' }}>
      <Row>
        <Col xs="12" md="8">
          <VerticalTimeline>{
            this.props.enrolment.progress.map( e => (
              <VerticalTimelineElement iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }} icon={<FontAwesome name="bookmark" />}>
                <h3 key={e} className="vertical-timeline-element-title">{e}</h3>
                <p>Completed</p>
              </VerticalTimelineElement>
            ))
          }
            {
              this.props.enrolment.certId ? (
                <VerticalTimelineElement
                  date={this.props.enrolment.certIssued}
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                >
                  <h3 className="vertical-timeline-element-title">certificate!!</h3>
                  <p>Details and such here</p>
                </VerticalTimelineElement>
              ) : null
            }
          </VerticalTimeline>
        </Col>
      </Row>
    </Container>
  )
}

export default CourseProgress;
