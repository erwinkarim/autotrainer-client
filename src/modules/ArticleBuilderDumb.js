import React, { Component } from 'react';
import { Row, Col, FormGroup, Label, Card } from 'reactstrap';
import PropTypes from 'prop-types';
import Editor from '../components/Editor';

/*
  TODO:
    * table support
    * step-by-step accordion support
*/

/**
 * Adds two numbers together.
 * @param {int} e The first number.
 * @returns {int} The sum of the two numbers.
 */
export default class ArticleBuilder extends Component {
  componentDidMount = async () => {
    this.editor.setEditorStateFromRaw(this.props.module.body);
  }
  validBody = () => this.editor.hasText()
  render = () => (
    <Row>
      <Col xs={{ size: 11, offset: 1 }} sm={{ size: 12, offset: 0 }} lg={{ size: 8, offset: 0 }} >
        <FormGroup>
          <Label>Article Body</Label>
          <Card className="p-3">
            <Editor
              ref={(editor) => { this.editor = editor; }}
              handleBodyUpdate={this.props.handleBodyUpdate}
            />
          </Card>
        </FormGroup>
      </Col>
    </Row>
  )
}

ArticleBuilder.propTypes = {
  module: PropTypes.shape().isRequired,
  handleBodyUpdate: PropTypes.func.isRequired,
};

ArticleBuilder.defaultProps = { };
