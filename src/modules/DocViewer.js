import React from 'react';
import { Container } from 'reactstrap';
import PropTypes from 'prop-types';
import DocPreview from '../components/DocPreview';

/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
const DocViewer = (props) => {
  const fileLoc = props.module.body === null || props.module.body === undefined ?
    null :
    props.module.body.location || props.module.body;

  return (
    <Container>
      {
        fileLoc === null ?
          <p>Document not configured. Contact author if you expecting a documment.</p> :
          <DocPreview file={fileLoc} triggerComplete={props.triggerAttendance} />
      }
    </Container>
  );
};

export default DocViewer;

DocViewer.propTypes = {
  module: PropTypes.shape().isRequired,
  triggerAttendance: PropTypes.func.isRequired,
};
