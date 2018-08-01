import React from 'react';
import {
  FormGroup, Label, InputGroup, Input, InputGroupAddon, InputGroupText,
  FormText, Jumbotron, Container, Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { titleNotEmpty } from './formValidation';


/*
  course form detaling the course info (name, modules, etc ..)
*/
const CourseForm = (props) => {
  if (props.course === undefined || props.course === null) {
    return (<div>Course not loaded yet ... </div>);
  }

  const bgStyling = props.bg_pic_data ?
    { backgroundImage: `url(${props.bg_pic_data})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } :
    {};
  const titleFontStyling = props.course.title_font_color ?
    { color: props.course.title_font_color } : { color: 'black' };
  let styling = Object.assign({}, bgStyling);
  styling = Object.assign(styling, titleFontStyling);

  let bgFileName = '';
  if (props.bg_handle) {
    bgFileName = (props.bg_handle instanceof Object ? props.bg_handle.name : props.bg_handle);
  }

  return (
    <div className="mt-2">
      <p>This section will configure your common theme for your course such as the headers.</p>
      <h4>
        Course Header
      </h4>
      <hr />
      <p className="text-mute">
        The header will appear in your course pages
      </p>
      <FormGroup>
        <Label>Name</Label>
        <h1 className="text-center">
          <InputGroup>
            <Input
              type="text"
              placeholder="Course Name. Should be less than 140 characters"
              className="display-3 text-center"
              style={{ fontSize: 'inherit' }}
              maxLength="140"
              id="name"
              value={props.course.name}
              onChange={props.handleChange}
              invalid={!titleNotEmpty(props.course)}
            />
            <InputGroupAddon addonType="append" className="text-muted"><InputGroupText>{ 140 - props.course.name.length}</InputGroupText></InputGroupAddon>
          </InputGroup>
        </h1>
      </FormGroup>
      <FormGroup>
        <Label>Font Color</Label>
        <Input
          type="select"
          id="title_font_color"
          value={props.course.title_font_color}
          onChange={props.handleChange}
        >
          <option value="black">Black</option>
          <option value="darkslategray">Dark Slate Gray</option>
          <option value="gray">Gray</option>
          <option value="gainsboro">Gainsboro</option>
          <option value="ghostwhite">Ghost White</option>
          <option value="white">White</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label>Background Picture</Label>
        <Input type="file" placeholder="Background picture" id="bg_pic" onChange={props.handleChange} />
        <FormText color="muted">JPEG only images. Should fit in 1600x900 pixels and under 2 MB in size.</FormText>
        {
          props.course.bg_pic ? <Input disabled value={bgFileName} /> : null
        }
      </FormGroup>
      <p>Preview</p>
      <Jumbotron fluid style={styling} className="text-center">
        <Container>
          <h1 className="display-3 text-center">{props.course.name}</h1>
          { props.course.tagline !== undefined ? (<p className="lead">{props.course.tagline}</p>) : null}
          <p><Button outline color="primary">Enrol for RM{props.course.price}</Button></p>
        </Container>
      </Jumbotron>
      <FormGroup>
        <Label>Tagline</Label>
        <InputGroup>
          <Input
            type="text"
            placeholder="Tag Line. Should be less than 140 characters"
            id="tagline"
            className="lead text-center"
            maxLength="140"
            value={props.course.tagline}
            onChange={props.handleChange}
          />
          <InputGroupAddon addonType="append" className="text-muted">
            <InputGroupText>{ 140 - props.course.tagline.length }</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
      <Button color="primary" onClick={props.handleUpdateCourse} disabled={!props.validateGeneralForm()}>Update Course Setting</Button>
    </div>);
};

CourseForm.propTypes = {
  course: PropTypes.shape().isRequired,
  bg_pic_data: PropTypes.string,
  bg_handle: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  handleUpdateCourse: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  validateGeneralForm: PropTypes.func.isRequired,
};

CourseForm.defaultProps = {
  bg_pic_data: {},
  bg_handle: {},
};

export default CourseForm;
