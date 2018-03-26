import React, { Component } from 'react';
import { Button, Card, CardImg, CardBody, CardText, Input } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { insertDataBlock } from 'megadraft';
import PropTypes from 'prop-types';

/**
 * Adds two numbers together.
 * @param {int} e The first number.
 * @returns {int} The sum of the two numbers.
 */
class ImageButton extends Component {
  onClick = (e) => {
    e.preventDefault();
    const src = window.prompt('Enter a URL');
    const data = { type: 'image', src, caption: '' };
    // Calls the onChange method with the new state.
    this.props.onChange(insertDataBlock(this.props.editorState, data));
  }
  render = () =>
    (
      <Button onClick={this.onClick} title="Image" className="rounded-circle p-0 sidebar-button">
        <FontAwesome name="image" />
      </Button>
    )
}

ImageButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  editorState: PropTypes.shape({}).isRequired,
};

const ImageBlock = (props) => {
  const {
    value,
    error,
    styles,
    blockProps,
    ...otherProps
  } = props;

  return (
    <Card {...otherProps}>
      <CardImg top src={props.data.src} />
      <CardBody>
        {
          blockProps.getInitialReadOnly() ?
            <CardText>{props.data.caption}</CardText> :
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

ImageBlock.propTypes = {
  data: PropTypes.shape({
    src: PropTypes.string,
    caption: PropTypes.string,
    updateUrl: PropTypes.string,
    data: PropTypes.string,
  }),
  value: PropTypes.number,
  error: PropTypes.shape({}),
  styles: PropTypes.shape({}),
  blockProps: PropTypes.shape({}),
  container: PropTypes.shape({
    updateData: PropTypes.func,
  }).isRequired,
};

ImageBlock.defaultProps = {
  data: {
    src: 'http://placehold.it/256x256',
    caption: 'Test Image',
  },
  value: 0,
  error: {},
  styles: {},
  blockProps: {},
};

/*
  new image plugin
*/
const ImagePlugin = {
  title: 'Image',
  type: 'image',
  buttonComponent: ImageButton,
  blockComponent: ImageBlock,
};

export default ImagePlugin;
