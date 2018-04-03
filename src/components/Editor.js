import React, { Component } from 'react';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';
import { ContentState, EditorState, convertFromHTML } from 'draft-js';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import ImagePlugin from './EditorPlugins/ImagePlugin';
import VideoPlugin from './EditorPlugins/VideoPlugin';
import '../../node_modules/megadraft/dist/css/megadraft.css';
import './Editor.css';

const StrikethroughIcon = () => <FontAwesome name="strikethrough" />;
const UnderlineIcon = () => <FontAwesome name="underline" />;

/**
 * Editor
 * @param {int} editorState The first number.
 * @param {int} newContent The first number.
 * @returns {int} The sum of the two numbers.
 */
export default class Editor extends Component {
  /**
   * Editor constroctor
   * @param {int} props The first number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { editorState: editorStateFromRaw(null) };
  }
  componentDidMount = () => {
    const customActions = this.editor.props.actions;
    customActions.splice(
      2,
      0,
      {
        type: 'inline', label: 'S', style: 'STRIKETHROUGH', icon: StrikethroughIcon,
      },
    );
    customActions.splice(
      2,
      0,
      {
        type: 'inline', label: 'U', style: 'UNDERLINE', icon: UnderlineIcon,
      },
    );

    this.setState({ customActions });
  }
  setEditorStateFromRaw = (newContent) => {
    // detect if html or json
    /*
    var newEditorState = newContent === '' ?
      editorStateFromRaw(null) :
    newContent.charAt(0) === '<' ?
      EditorState.createWithContent( ContentState.createFromBlockArray(
        convertFromHTML(newContent).contentBlocks,
        convertFromHTML(newContent).entityMap
      )) :
      editorStateFromRaw( JSON.parse(newContent) );
      */
    let newEditorState = editorStateFromRaw(null);
    if (newContent.charAt(0) === '<') {
      newEditorState = EditorState.createWithContent(ContentState.createFromBlockArray(
        convertFromHTML(newContent).contentBlocks,
        convertFromHTML(newContent).entityMap,
      ));
    } else if (newContent !== '') {
      newEditorState = editorStateFromRaw(JSON.parse(newContent));
    }
    this.setState({ editorState: newEditorState });
  }
  getRaw = () => editorStateToJSON(this.state.editorState)
  hasText = () => this.state.editorState.getCurrentContent().hasText()
  handleChange = (editorState) => {
    if (this.props.readOnly) {
      return;
    }

    this.setState({ editorState });
    if (this.props.handleBodyUpdate) {
      this.props.handleBodyUpdate(this.getRaw());
    }

    // onChange={this.props.readOnly ? null : editorState => this.setState({ editorState })}
  }
  render =() => (
    <MegadraftEditor
      placeholder="Start typing away ..."
      ref={(editor) => { this.editor = editor; }}
      actions={this.state.customActions}
      plugins={[ImagePlugin, VideoPlugin]}
      editorState={this.state.editorState}
      onChange={this.handleChange}
      readOnly={this.props.readOnly ? this.props.readOnly : false}
    />
  )
}

Editor.propTypes = {
  readOnly: PropTypes.bool,
  handleBodyUpdate: PropTypes.func,
};

Editor.defaultProps = {
  readOnly: false,
  handleBodyUpdate: null,
};
