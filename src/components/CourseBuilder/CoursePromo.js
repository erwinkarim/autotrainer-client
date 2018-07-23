import React from 'react';
import { FormGroup, Input } from 'reactstrap';
import PropTypes from 'prop-types';

/*
  handles course promo things
 */
const CoursePromo = props => (
  <div className="mt-2">
    <h3>Promotional Content</h3>
    <small>
      This will appear in your course promotion page. Which can viewed at{' '}
      {window.location.protocol}{'//'}{window.location.host}/courses/promo/{props.course.courseId}
    </small>
    <FormGroup>
      <Input
        type="textarea"
        rows="30"
        id="promoContent"
        value={props.course.promoContent}
        onChange={props.handleChange}
        placeholder="Type in the things that you wanted to see in the promo page"
      />
    </FormGroup>
  </div>
);

CoursePromo.propTypes = {
  course: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    promoContent: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default CoursePromo;
