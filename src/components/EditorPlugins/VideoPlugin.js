import React, { Component } from 'react';
import { Button, Card, CardImg, CardBody, CardText, Input } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { insertDataBlock } from 'megadraft';
import PropTypes from 'prop-types';

/**
 * VideoButton
 * @param {int} e The first number.
 * @param {int} src The first number.
 * @returns {int} The sum of the two numbers.
 */
class VideoButton extends Component {
  onClick = (e) => {
    e.preventDefault();
    const src = window.prompt('Enter a URL');
    const data = {
      type: 'video',
      src,
      caption: '',
      updatedUrl: this.updateUrl(src),
    };
    // Calls the onChange method with the new state.
    this.props.onChange(insertDataBlock(this.props.editorState, data));
  }
  updateUrl = (src) => {
    // convert url into embed url
    try {
      const origUrl = new URL(src);
      let videoUrl = '';
      if (origUrl.hostname === 'www.youtube.com' || origUrl.hostname === 'youtube.com') {
        videoUrl = `https://www.youtube.com/embed/${origUrl.searchParams.get('v')}`;
      } else if (origUrl.hostname === 'www.vimeo.com' || origUrl.hostname === 'vimeo.com') {
        videoUrl = `https://player.vimeo.com/video${origUrl.pathname}`;
      }
      return videoUrl;
    } catch (e) {
      console.log('error updating video url');
      console.log(e);
      return false;
    }
  }
  render = () => (
    <Button type="button" onClick={this.onClick} title="video" className="rounded-circle p-0 sidebar-button">
      <FontAwesomeIcon icon="video" fixedWidth className="p-0" />
    </Button>
  )
}

VideoButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  editorState: PropTypes.shape({}),
};

VideoButton.defaultProps = {
  editorState: {},
};

const VideoBlock = (props) => {
  const {
    value,
    error,
    styles,
    blockProps,
    ...otherProps
  } = props;
  return (
    <Card {...otherProps} >
      <CardImg top tag="div" className="embed-responsive embed-responsive-16-by-9" style={{ height: '300px' }}>
        <CardImg top tag="iframe" width="1600" src={props.data.updatedUrl} />
      </CardImg>
      <CardBody>
        {
          blockProps.getInitialReadOnly() ?
          <CardText>{ props.data.caption }</CardText> :
          <Input
            type="text"
            className="border-0"
            rows="1"
            onChange={(e) => { props.container.updateData({ caption: e.target.value }); }}
            value={props.data.caption}
            placeholder={props.data.src}
          />
        }
      </CardBody>
    </Card>
  );
};

VideoBlock.propTypes = {
  data: PropTypes.shape({
    updateUrl: PropTypes.string,
    data: PropTypes.string,
  }).isRequired,
  value: PropTypes.number,
  error: PropTypes.shape({}),
  styles: PropTypes.shape({}),
  blockProps: PropTypes.shape({}),
};

VideoBlock.defaultProps = {
  value: 0,
  error: {},
  styles: {},
  blockProps: {},
};

const VideoPlugin = {
  title: 'Video',
  type: 'video',
  buttonComponent: VideoButton,
  blockComponent: VideoBlock,
};

export default VideoPlugin;
