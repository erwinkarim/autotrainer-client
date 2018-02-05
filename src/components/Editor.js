import React, { Component } from "react";
import {MegadraftEditor, editorStateFromRaw, editorStateToJSON, insertDataBlock }  from "megadraft";
import { ContentState, EditorState, convertFromHTML } from 'draft-js'
import FontAwesome from 'react-fontawesome';
import '../../node_modules/megadraft/dist/css/megadraft.css';
import './Editor.css';
import { Button, Card, CardImg, CardBody, CardText, Input } from 'reactstrap';

export default class Editor extends Component{
  constructor(props){
    super(props);
    this.state = { editorState: editorStateFromRaw(null) };
  }
  componentDidMount = () => {
    var customActions = this.editor.props.actions;
    customActions.splice(2,0,
      {type: "inline", label: 'S', style: 'STRIKETHROUGH', icon: StrikethroughIcon }
    );
    customActions.splice(2,0,
      {type: "inline", label: "U", style: "UNDERLINE", icon: UnderlineIcon}
    );

    this.setState({customActions});
  }
  setEditorStateFromRaw = (newContent) => {
    //detect if html or json
    var newEditorState = newContent === '' ?
      editorStateFromRaw(null) :
    newContent.charAt(0) === '<' ?
      EditorState.createWithContent( ContentState.createFromBlockArray(
        convertFromHTML(newContent).contentBlocks,
        convertFromHTML(newContent).entityMap
      )) :
      editorStateFromRaw( JSON.parse(newContent) );
    this.setState({editorState:newEditorState});
  }
  getRaw = () => editorStateToJSON(this.state.editorState)
  hasText = () => this.state.editorState.getCurrentContent().hasText()
  render(){

    return (
      <MegadraftEditor placeholder="Start typing away ..."
        ref={(editor) => {this.editor = editor;}}
        actions={this.state.customActions}
        plugins={[ImagePlugin, VideoPlugin]}
        editorState={this.state.editorState}
        onChange={this.props.readOnly ? null : (editorState) => this.setState({editorState})}
        readOnly={this.props.readOnly ? this.props.readOnly : false } />
    )
  }
}

class UnderlineIcon extends React.Component {
  render() {
    return (
      <FontAwesome name="underline" />
    );
  }
}

class StrikethroughIcon extends React.Component {
  render() {
    return (
      <FontAwesome name="strikethrough" />
    );
  }
}


class ImageButton extends Component {
  onClick = (e) => {
    e.preventDefault();
    const src = window.prompt("Enter a URL");
    const data = {"type": "image", "src": src, caption:''};
    // Calls the onChange method with the new state.
    this.props.onChange(insertDataBlock(this.props.editorState, data));
  }
  render() {
    return (
      <Button onClick={this.onClick} title="Image" className="rounded-circle p-0 sidebar-button">
        <FontAwesome name="image" />
      </Button>
    );
  }
}

class ImageBlock extends Component {
  render(){
    let {value, error, styles, blockProps, ...props} = this.props;

    return (
      <Card {...props}>
        <CardImg top src={this.props.data.src} />
        <CardBody>
          {
            blockProps.getInitialReadOnly() ?
            <CardText>{this.props.data.caption}</CardText> :
            <Input type="text" className="border-0"
              rows="1"
              onChange={ (e) => { this.props.container.updateData({caption: e.target.value}); }}
              value={this.props.data.caption} placeholder={this.props.data.src} />
          }
        </CardBody>
      </Card>
    );
  }
}

/*
  should autoconvert links from youtube / vimeo to embed links
*/
class VideoButton extends Component {
  updateUrl = (src) => {
    //convert url into embed url
    try {
      var origUrl = new URL(src);
      var videoUrl =
        origUrl.hostname === 'www.youtube.com' || origUrl.hostname === 'youtube.com' ?
          `https://www.youtube.com/embed/${origUrl.searchParams.get('v')}` :
        origUrl.hostname === 'www.vimeo.com' || origUrl.hostname === 'vimeo.com' ?
          `https://player.vimeo.com/video${origUrl.pathname}` :
        '';
      return videoUrl;
    } catch(e){
      console.log('error updating video url')
      console.log(e)
      return false;
    }
  }
  onClick = (e) => {
    e.preventDefault();
    const src = window.prompt("Enter a URL");
    const data = {"type": "video", "src": src, caption:'', updatedUrl:this.updateUrl(src)};
    // Calls the onChange method with the new state.
    this.props.onChange(insertDataBlock(this.props.editorState, data));
  }
  render() {
    return (
      <Button type="button" onClick={this.onClick} title='video' className="rounded-circle p-0 sidebar-button">
        <FontAwesome name="video" fixedWidth className="p-0" />
      </Button>
    );
  }
}


class VideoBlock extends Component {
  render(){
    let {value, error, styles, blockProps, ...props} = this.props;

    return (
      <Card {...props}>
        <CardImg top tag="div" className="embed-responsive embed-responsive-16-by-9" style={ {height:'300px'}}>
          <CardImg top tag="iframe" width="1600" src={this.props.data.updatedUrl} />
        </CardImg>
        <CardBody>
          {
            blockProps.getInitialReadOnly() ?
            <CardText>{this.props.data.caption}</CardText> :
            <Input type="text" className="border-0"
              rows="1"
              onChange={ (e) => { this.props.container.updateData({caption: e.target.value}); }}
              value={this.props.data.caption} placeholder={this.props.data.src} />
          }
        </CardBody>
      </Card>
    );
  }

}

/*
  new image plugin
*/
const ImagePlugin = {
  // Friendly plugin name
  title: "Image",
  // A unique plugin name used to identify the plugin and its blocks
  type: "image",
  // React component to be rendered in the block sidebar
  buttonComponent: ImageButton,
  // React component for rendering the content block
  blockComponent: ImageBlock
};

const VideoPlugin = {
  title: "Video",
  type: "video",
  buttonComponent: VideoButton,
  blockComponent: VideoBlock
};
