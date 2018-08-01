import React from 'react';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { descriptionNotEmpty } from './formValidation';

const CourseTOCForm = props => (
  <div className="mt-2">
    <p>
      This will appear in your TOC page
      Which can be viewed in {window.location.protocol}{'//'}courses/toc/{props.course.courseId}
    </p>
    <FormGroup>
      <Label>Description / Final Thoughts</Label>
      <Input
        className="lead"
        type="textarea"
        rows="20"
        id="description"
        value={props.course.description}
        onChange={props.handleChange}
        invalid={!descriptionNotEmpty(props.course)}
      />
    </FormGroup>
    <Button color="primary" onClick={props.handleUpdateCourse} disabled={!props.validateGeneralForm()}>Update Course Setting</Button>
  </div>
);

CourseTOCForm.propTypes = {
  course: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleUpdateCourse: PropTypes.func.isRequired,
  validateGeneralForm: PropTypes.func.isRequired,
};

export default CourseTOCForm;
