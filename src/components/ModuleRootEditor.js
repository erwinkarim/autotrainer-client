import React from 'react';
import { Col, FormGroup, Label, InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap';
import PropTypes from 'prop-types';

/*
  a component to manage editing for name and description of the module
    required props. module and handleChange
 */

const ModuleRootEditor = props => (
  <Col xs="12" lg="8" className="text-left">
    <FormGroup>
      <Label>Title</Label>
      <InputGroup>
        <Input
          type="text"
          placeholder="Title for the document. Should be less than 140 characters"
          maxLength="140"
          id="title"
          value={props.module.title}
          onChange={props.handleChange}
          disabled={props.updating}
        />
        <InputGroupAddon addonType="append" className="text-muted"><InputGroupText>{ 140 - props.module.title.length }</InputGroupText></InputGroupAddon>
      </InputGroup>
    </FormGroup>
    <FormGroup>
      <Label>Description</Label>
      <Input
        type="textarea"
        rows="20"
        placeholder={`A description about this ${props.module.moduleType}`}
        id="description"
        value={props.module.description}
        onChange={props.handleChange}
        disabled={props.updating}
      />
    </FormGroup>
    <FormGroup>
      <Label>Publish status</Label>
      <Input type="select" id="publish_status" value={props.module.publish_status} onChange={props.handleChange} disabled={props.updating}>
        <option value="unpublished">Unpublished</option>
        <option value="published">Published</option>
      </Input>
    </FormGroup>
  </Col>
);

ModuleRootEditor.propTypes = {
  module: PropTypes.shape({
    title: PropTypes.string,
    publish_status: PropTypes.string,
    moduleType: PropTypes.string,
    description: PropTypes.string,
  }),
  handleChange: PropTypes.func,
  updating: PropTypes.bool.isRequired,
};

ModuleRootEditor.defaultProps = {
  module: { title: '', description: '', moduleType: 'doc' },
  handleChange: () => 0,
};

export default ModuleRootEditor;
