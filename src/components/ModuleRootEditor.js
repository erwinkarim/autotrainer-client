import React, { Component } from "react";
import {Col, FormGroup,Label, InputGroup, Input, InputGroupAddon } from 'reactstrap';

/*
  a component to manage editing for name and description of the module
    required props. module and handleChange
 */

 export default class ModuleRootEditor extends Component {
   render(){
     return (
      <Col xs="12" lg="8" className="text-left">
        <FormGroup>
          <Label>Title</Label>
          <InputGroup>
            <Input type="text" placeholder="Title for the document. Should be less than 140 characters" maxLength="140"
              id="title" value={this.props.module.title} onChange={this.props.handleChange}/>
            <InputGroupAddon>{ 140 - this.props.module.title.length }</InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <Input type="textarea" rows="20" placeholder={`A description about this ${this.props.module.moduleType}`}
            id="description" value={this.props.module.description} onChange={this.props.handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Publish status</Label>
          <Input type="select" id="publish_status" value={this.props.module.publish_status} onChange={this.props.handleChange}>
            <option value="unpublished">Unpublished</option>
            <option value="published">Published</option>
          </Input>
        </FormGroup>
      </Col>
    );

   }
 }

 ModuleRootEditor.defaultProps = {
   module: { title:'', description:'', moduleType:'doc'},
   handleChange: () => { return 0 }
 }
