import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, FormGroup, Col, Input, Button } from 'reactstrap';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import EmailValidator from 'email-validator';
import Waypoint from 'react-waypoint';
import FontAwesome from 'react-fontawesome';

const url = 'https://actuarialpartners.us12.list-manage.com/subscribe/post?u=4756f46f9638924614f4859b2&id=d717210507';

/**
 * The SignUpModal
 * @param {int} e The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */
export default class SignUpModal extends Component {
  /**
   * Adds two numbers together.
   * @param {object} props The first number.
   * @param {int} num2 The second number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);

    this.state = {
      showNewsletterModal: false,
      signup_email: '',
      first_name: '',
      last_name: '',
      signing_up: false,
      waypointTriggered: false,
    };
  }
  launchNewsletterModal = () => {
    console.log('should launch news letter modal');
    this.setState({ showNewsletterModal: true });
  }
  handleNewsletterSignUp = async () => {
    console.log('should send email to sendgrid / mailchimp');


    this.setState({ signing_up: true });


    this.props.addNotification('Thank you for signing up', 'info');

    // reset
    this.setState({
      signing_up: false, showNewsletterModal: false, signup_email: '', first_name: '', last_name: '',
    });
  }
  toggleModal = () => this.setState({ showNewsletterModal: !this.state.showNewsletterModal })
  triggerWaypoint = () => {
    // trigger the waypoint only once per render
    if (!this.state.waypointTriggered) {
      this.setState({ waypointTriggered: true });
      this.toggleModal();
    }
  }
  validateFirstName = () => this.state.first_name.length > 0
  validateLastName = () => this.state.last_name.length > 0
  validateNewsletterModal = () => EmailValidator.validate(this.state.signup_email)
  render = () => (
    <div>
      <Button outline color="info" onClick={this.launchNewsletterModal}>Join Newsletter</Button>
      <Waypoint onEnter={this.triggerWaypoint} />
      <Modal isOpen={this.state.showNewsletterModal} toggle={this.toggleModal} size="lg">
        <ModalBody>
          <MailchimpSubscribe url={url} />
          <p>Stay informed of the latest updates by joining our newsletter:</p>
          <FormGroup row>
            <Col xs="12" md="6" className="mb-2">
              <Input
                type="text"
                value={this.state.first_name}
                ref={(input) => { this.first_name = input; }}
                invalid={!this.validateFirstName()}
                onChange={e => this.setState({ first_name: e.target.value })}
                placeholder="First Name"
              />
            </Col>
            <Col xs="12" md="6" className="">
              <Input
                type="text"
                value={this.state.last_name}
                invalid={!this.validateLastName()}
                onChange={e => this.setState({ last_name: e.target.value })}
                placeholder="Last Name"
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Input
              type="email"
              value={this.state.signup_email}
              invalid={!this.validateNewsletterModal()}
              onChange={e => this.setState({ signup_email: e.target.value })}
              placeholder="email address"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button outline color="danger" onClick={this.toggleModal}>No Thanks</Button>
          <Button
            color="primary"
            onClick={this.handleNewsletterSignUp}
            disabled={
              !(this.validateNewsletterModal() &&
                this.validateFirstName() && this.validateLastName())
              || (this.state.signing_up)}
          >
            { this.state.signing_up ? <FontAwesome name="asterisk" spin /> : null }
            Sign Up
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
