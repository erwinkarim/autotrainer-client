import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import Waypoint from 'react-waypoint';
import Editor from '../components/Editor';

/**
 * Module describe the article
 * @returns {Object}    the article
 */
export default class Article extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  componentDidMount = () => {
    this.editor.setEditorStateFromRaw(this.props.module.body);
  }
  render = () => (
    <div className="text-left">
      <Container>
        { /* actual */}
        <Row>
          <Col xs="12" md="8" className="text-justify">
            <Editor ref={(editor) => { this.editor = editor; }} readOnly />
          </Col>
        </Row>
      </Container>
      <Waypoint onEnter={this.props.triggerAttendance} />
    </div>
  )
}

Article.propTypes = {
  module: PropTypes.shape().isRequired,
  triggerAttendance: PropTypes.func.isRequired,
};
