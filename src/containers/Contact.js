import React, { Component } from 'react';
import {
  Container, Row, Form, FormGroup, Label, Input, Button,
  Card, CardTitle, CardBody, CardText,
} from 'reactstrap';
import AWS from 'aws-sdk';
import ReCAPTCHA from 'react-google-recaptcha';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyA54dSQGPIJQ-oWwmIcg788iRlbE9BRfK4&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(() => (
  <GoogleMap defaultZoom={18} defaultCenter={{ lat: 3.152743, lng: 101.710467 }}>
    <Marker position={{ lat: 3.152743, lng: 101.710467 }} />
  </GoogleMap>
));

// 3.152743, 101.710467
/**
 * Contact Page
 * @param {object} e The first number.
 * @returns {int} The sum of the two numbers.
 */
export default class Contact extends Component {
  /**
   * Contact Page constructor
   * @param {object} props The first number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      captchaPassed: false,
      delivered: false,
    };
  }
  componentDidMount = () => {
    console.log(this.props.currentUser);
    /*
    if (this.props.currentUser != null) {
      this.setState({ email: this.props.currentUser.email });
    }
    */
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log('handle submit');

    const ses = new AWS.SES({
      // accessKeyId: 'AKIAJ5WR6ZQX2ICW7SSA',
      // secretAccessKey: 'AjKNqQYIy0M4MFjHltAMWt3dFl+kwy53GajQ2ER/9oCA',
      region: 'us-west-2',
    });
    const handle = this;

    const emailParams = {
      Destination: {
        ToAddresses: ['enquiry@actuarialpartners.com', this.props.currentUser.email],
      },
      Message: {
        Body: {
          Html: {
            Data: this.state.comment,
            Charset: 'UTF-8',
          },
          Text: {
            Data: this.state.comment,
            Charset: 'UTF-8',
          },
        },
        Subject: {
          Data: `Enquiry / Comment from ${this.props.currentUser.name}`,
          Charset: 'UTF-8',
        },
      },
      Source: 'enquiry@actuarialpartners.com',
      // SourceArn: 'arn:aws:iam::167457616767:user/ses-smtp-user.20180110-122353',
      // ConfigurationSetName: 'STRING_VALUE',
      ReplyToAddresses: [this.props.currentUser.email],
    };

    // send contents to enquiry@actuarialpartners.com
    ses.sendEmail(emailParams, (err, data) => {
      if (err) {
        handle.props.addNotification('Error sending email', 'danger');
        console.log(err);
      } else {
        handle.props.addNotification('Successfully sent message', 'success');
        handle.setState({ delivered: true });
        console.log(data);
      }
    });
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }
  validateForm = () => (this.state.comment.length > 0 && this.state.captchaPassed)
  captcha = () => {
    // should change to check captcha state
    console.log('captcha changed state');
    this.setState({ captchaPassed: !this.state.captchaPassed });
  }
  render = () => {
    let contactForm = null;
    if (this.props.currentUser === null) {
      contactForm = (
        <Card body>
          <CardTitle>You must login to send comments</CardTitle>
          <CardText>
            Please contact <a href="tel:+60321610433">+60 3-2161 0433</a> during office hours
            for immediate response
          </CardText>
        </Card>
      );
    } else if (this.state.delivered) {
      contactForm = (
        <Card body>
          <CardTitle>Thank you.</CardTitle>
          <CardText>
            Your message has been sent. Our associate will address your concerns soon
          </CardText>
        </Card>
      );
    } else {
      contactForm = (
        <Form onSubmit={this.handleSubmit} className="text-left">
          <FormGroup>
            <Label>Email:</Label>
            <Input id="email" type="email" placeholder="Email" value={this.props.currentUser.email} disabled />
          </FormGroup>
          <FormGroup>
            <Label>Comment / Suggestion</Label>
            <Input
              type="textarea"
              rows="15"
              placeholder="Your comments and suggestion ..."
              id="comment"
              value={this.state.comment}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <ReCAPTCHA sitekey="6LeXCjwUAAAAAJS-BFBlmUAaC5KnB_ykR5uJ2g_M" onChange={this.captcha} />
          </FormGroup>
          <Button color="primary" type="submit" disabled={!this.validateForm()}>Send</Button>
        </Form>
      );
    }

    return (
      <Container className="mt-2">
        <Row>
          <div className="col-12 col-md-8 text-left mb-3">
            <h4>Contact Us</h4>
            <hr />
            { contactForm }
          </div>
          <div className="col-12 col-md-8 mb-2">
            <MyMapComponent />
          </div>
          <div className="col-12 col-md-4 text-left">
            <Card>
              <CardBody>
                <address>
                  <strong>Actuarial Partners Consulting Sdn. Bhd.,</strong><br />
                  Suite 17.02, Kenanga International, <br />
                  Jalan Sultan Ismail, <br />
                  50250 Kuala Lumpur, Malaysia.
                </address>
                <CardText>
                  Tel: <a href="tel:+60321610433">+60 3-2161 0433</a><br />
                  Fax: +60 3-2161 3595 <br />
                </CardText>
                <CardText>Business Hours: Monday-Friday, 8.30am-5.00pm (GMT +8)</CardText>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    );
  }
}

Contact.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};