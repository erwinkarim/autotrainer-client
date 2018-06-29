import React from 'react';
import { Container, Jumbotron } from 'reactstrap';
import PropTypes from 'prop-types';

const Video = (props) => {
  // for now, trigger complete on video loaded,
  // in the future, will load the appropiate player, and trigger on watch complete
  props.triggerAttendance();

  const video = props.module;
  const validVideo = props.module.body.origUrl.length > 0 &&
    props.module.body.convertedUrl.length > 0;

  return (
    <div className="mt-3">
      <Jumbotron fluid>
        <Container>
          { validVideo ?
            <div>
              <div className="embed-responsive embed-responsive-16-by-9" style={{ height: '900px' }}>
                <iframe src={video.body.convertedUrl} title={video.title} width="1600" />
              </div>
              { video.body.description.split('\n').map(p => <p key={parseInt(Math.random() * 1000, 10)} className="text-left">{p}</p>)}
            </div>
            : <h4>Video is not valid</h4>
          }
        </Container>
      </Jumbotron>
    </div>
  );
};

export default Video;

Video.propTypes = {
  triggerAttendance: PropTypes.func.isRequired,
  module: PropTypes.shape({
    body: PropTypes.shape(),
  }).isRequired,
};
