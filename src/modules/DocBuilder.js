import React, { Component } from 'react';
import { Row, Col, FormText, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import DocPreview from '../components/DocPreview';
import config from '../config';
import { s3Upload, s3Delete } from '../libs/awsLibs';

const defaultBody = {
  location: '',
  key: '',
};

/**
 * Adds two numbers together.
 * @param {int} e The first number.
 * @returns {int} The sum of the two numbers.
 */
export default class DocBuilder extends Component {
  /**
   * Adds two numbers together.
   * @param {int} props The first number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { file: null };
  }
  componentDidMount = () => {
    const { module } = this.props;

    if (!module.body) {
      this.props.handleBodyUpdate(defaultBody);
    }

    this.setState({ file: module.body === undefined ? '' : module.body.location });
    console.log('file', this.state.file);
  }
  handleFileChange = (e) => {
    const fileHandle = e.target.files[0];
    const handle = this;

    if (e.target.files === undefined) {
      // nothing is selected
      return;
    }

    if (fileHandle.type !== 'application/pdf') {
      console.log('Only support pdf files at this moment');
      handle.props.addNotification('Only pdf files are supported at this moment', 'danger');
      return;
    }

    this.setState({ file: e.target.files[0] });
  }
  validBody = async () => {
    // valid body is called before file is updated
    // need better way to manage s3

    const handle = this;

    // check file size
    if (handle.state.file instanceof File && handle.state.file.size > config.MAX_ATTACHMENT_SIZE) {
      console.log('File must less than 5MB');
      handle.props.addNotification('Pdf size must be less than 5MB', 'danger');
      return false;
    }

    // if file is different than current one in s3, upload first then update the doc object
    // then update the body before returning as true
    try {
      // upload if the file state becomes a file object
      if (handle.state.file instanceof Object) {
        const oldKey = handle.props.module.body.key;

        console.log('upload new file ...');
        handle.props.setUpdatingState(true);
        const newFile = await s3Upload(handle.state.file);
        handle.props.setUpdatingState(false);
        this.props.handleBodyUpdate({ location: newFile.Location, key: newFile.key });
        handle.setState({ file: newFile.Location });

        // should delete the old file unless the old key is null
        if (oldKey !== null && oldKey !== '' && oldKey !== newFile.key) {
          console.log(`compare oldKey: ${oldKey} and newKey: ${newFile.key}`);
          console.log(`deleting file with key ${oldKey}`);
          await s3Delete(oldKey);
        }
      }

      return true;
    } catch (e) {
      console.log('error while uploading file / updating content');
      console.log(e);
    }

    return false;
  }
  render = () => {
    const { module } = this.props;
    const { file } = this.state;

    let fileName = '';
    if (module.body) {
      if (module.body.location) {
        fileName = module.body.location;
      }
    }
    /*
    const fileName =
      module.body === null ? '' : this.props.module.body.location;
      */
    return (
      <div className="my-3">
        <Row>
          <Col xs="12" lg="8" className="text-left">
            <FormGroup>
              <Label>File Location</Label>
              <Input type="text" disabled value={fileName} />
            </FormGroup>
            <FormGroup>
              <Label>File</Label>
              <Input type="file" onChange={this.handleFileChange} />
              <FormText>Supported file format: pdf</FormText>
              <FormText>File should be less than 5MB in size.</FormText>
            </FormGroup>
          </Col>
        </Row>
        {
          file === null || file === undefined || file === '' ?
            (<span>No file detected</span>) :
            <DocPreview file={this.state.file} showPath />
        }
      </div>
    );
  }
}

DocBuilder.propTypes = {
  module: PropTypes.shape(),
  handleBodyUpdate: PropTypes.func.isRequired,
};

DocBuilder.defaultProps = {
  module: {
    body: defaultBody,
  },
};
