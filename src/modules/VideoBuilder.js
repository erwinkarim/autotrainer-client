import React, { Component } from 'react';
import { Col, Row, FormGroup, Label, Input, FormText, Card, CardBody, CardText, CardImg } from 'reactstrap';
import PropTypes from 'prop-types';

const defaultBody = {
  origUrl: '',
  convertedUrl: '',
  description: '',
};

/**
 * Adds two numbers together.
 * @param {int} e The first number.
 * @returns {int} The sum of the two numbers.
 */
export default class VideoBuilder extends Component {
  /**
   * Adds two numbers together.
   * @param {shape} props props
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { validVideo: false };
  }
  componentDidMount = async () => {
    if (!this.props.module.body) {
      this.props.handleBodyUpdate(defaultBody);
    }

    this.setState({
      validVideo: this.props.module.body !== undefined &&
        this.props.module.body.origUrl.length > 0 &&
        this.props.module.body.convertedUrl.length > 0,
    });
  }
  validBody = () => this.state.validVideo &&
    this.props.module.body.description.length > 0
  handleVideoUrl = (e) => {
    // convert from youtube / vimeo url to embbed url
    const newVideo = this.props.module.body;
    console.log('target_url', e.target.value);
    const targetValue = e.target.value;

    try {
      const origUrl = new URL(targetValue);
      console.log('url_obj', origUrl);

      let videoUrl = null;
      let videoVendor = null;
      let videoID = null;

      if (origUrl.hostname === 'youtube.com' || origUrl.hostname === 'www.youtube.com') {
        videoUrl = `https://www.youtube.com/embed/${origUrl.searchParams.get('v')}`;
        videoVendor = 'YOUTUBE';
        videoID = origUrl.searchParams.get('v');
      } else if (origUrl.hostname === 'www.vimeo.com' || origUrl.hostname === 'vimeo.com') {
        videoUrl = `https://player.vimeo.com/video${origUrl.pathname}`;
        videoVendor = 'VIMEO';
        videoID = origUrl.pathname;
      }

      newVideo.origUrl = targetValue;
      newVideo.convertedUrl = videoUrl;
      newVideo.vendor = videoVendor;
      newVideo.videoID = videoID;

      // this.setState({url:origUrl, convertedUrl:videoUrl, validVideo:true});
      this.setState({ validVideo: videoUrl !== '' });
      this.props.handleBodyUpdate(newVideo);
    } catch (err) {
      console.log('error getting url name');
      newVideo.origUrl = targetValue;
      newVideo.convertedUrl = '';

      this.setState({ validVideo: false });
      this.props.handleBodyUpdate(newVideo);
    }
  }
  render = () => {
    const { module } = this.props;

    return (
      <div className="my-3">
        <Row>
          <Col xs="12" lg="8" className="text-left">
            <FormGroup>
              <Label>Video URL Link</Label>
              <Input type="text" value={module.body !== undefined ? module.body.origUrl : ''} onChange={this.handleVideoUrl} />
              <FormText color="muted">
                <ul>Valid formats are:-
                  <li>https://www.youtube.com/watch?v=XXXXXX</li>
                  <li>https://vimeo.com/XXXXXX</li>
                </ul>
              </FormText>
              <Label>Converted URL Link</Label>
              <Input type="text" disabled value={module.body !== undefined ? module.body.convertedUrl : ''} />
            </FormGroup>
            <FormGroup>
              <Label>Video Description</Label>
              <Input
                type="textarea"
                value={module.body !== undefined ? module.body.description : ''}
                rows="5"
                onChange={(e) => {
                  const newBody = module.body;
                  newBody.description = e.target.value;
                  this.props.handleBodyUpdate(newBody);
                }}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-left">
            <hr />
            <h4>Preview</h4>
            {
              this.state.validVideo ? (
                <Card>
                  <CardImg top tag="div" className="embed-responsive embed-responsive-16-by-9" style={{ height: '500px' }}>
                    <CardImg top tag="iframe" width="1600" src={module.body.convertedUrl} />
                  </CardImg>
                  {
                    module.body.description.length > 0 ?
                      <CardBody>
                        {
                          module.body.description.split('\n').map(p =>
                            <CardText key={parseInt(Math.random() * 1000, 10)}>{p}</CardText>)
                        }
                      </CardBody> : ''
                  }
                </Card>
              ) : (<p>Video link is invalid</p>)
            }
          </Col>
          <Col xs="12">
            <div id="yt_player" />
          </Col>
        </Row>
      </div>
    );
  }
}

VideoBuilder.propTypes = {
  module: PropTypes.shape().isRequired,
  handleBodyUpdate: PropTypes.func.isRequired,
};
