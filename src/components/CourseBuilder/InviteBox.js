import React, { Component } from 'react';
import { Row, Col, FormGroup, Input, Button, Collapse } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import EmailValidator from 'email-validator';
import { invokeApig } from '../../libs/awsLibs';
import config from '../../config';

/**
 * Adds two numbers together.
 * @param {shape} e event
 * @returns {JSX} the common builder
 */
export default class InviteBox extends Component {
  /**
   * Adds two numbers together.
   * @param {shape} props property clss
   * @returns {JSX} the common builder
   */
  constructor(props) {
    super(props);
    this.state = {
      showInviteForm: false, inviteList: [],
    };
  }
  componentDidMount = () => {
    this.addInvite();
  }
  handleChange = (e) => {
    if (e.target.id === 'inviteMessage') {
      this.setState({ inviteMessage: e.target.value });
      return;
    }

    const newInviteList = this.state.inviteList;
    newInviteList[e.target.dataset.index][e.target.dataset.attr] = e.target.value;
    this.setState({ inviteList: newInviteList });
  }
  toggleMenu = () => {
    this.setState({ showInviteForm: !this.state.showInviteForm });
  }
  handleSendInvite = async () => {
    console.log('process the email list and send invites ...');
    this.setState({ showInviteForm: false });

    // pre-flight checks
    // drop users that already has been invited
    this.props.students.forEach((e) => {
      // TODO: need to handle cases where user attributes doesn't exists
      const dropIndex = this.state.inviteList.findIndex((elm) => {
        // check if the user id is an email
        if (elm.email === e.userId) {
          return true;
        }

        // check for  userMeta info
        if (!e.userMeta) {
          return false;
        }

        if (!e.userMeta.UserAttributes) {
          return false;
        }

        return elm.email === e.userMeta.UserAttributes.find(urAtr => { return urAtr.Name === 'email'}).Value; });

      if (dropIndex !== -1) {
        console.log(`dropping ${this.state.inviteList[dropIndex].email} ...`);
        this.props.addNotification(`${this.state.inviteList[dropIndex].email} dropped from invite list ...`, 'danger');
        this.state.inviteList.splice(dropIndex, 1);
      }
    });

    // if the invite list is empty, drop the invite request
    if (this.state.inviteList.length === 0) {
      this.props.addNotification('Invite list is empty. Aborting invite request', 'danger');
      return;
    }

    // api call to send invite
    try {
      console.log(Date.now() / 1000, 'sending invite');
      await this.sendInvite();
    } catch (e) {
      console.log('error in sending invite');
      console.log(e);
      return;
    }

    // notification on invite sent
    this.props.addNotification('Invitation sent');

    // reset the invite list and reload the course
    this.setState({ inviteList: [] });

    // wait for a while
    // setTimeout( () => {}, 2000);

    // actually need to invoke the parents to reload the student list
    // TODO: just try to add the new invites in the student list instead of making an API call
    console.log(Date.now() / 1000, 'refreshing student list');
    this.props.handleLoadStudents();
  }
  sendInvite = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    method: 'POST',
    path: `/enrolment/${this.props.course.courseId}/invite`,
    body: {
      inviteList: this.state.inviteList,
      meta: { course_owner: this.props.currentUser.name },
    },
  })
  addInvite = (e) => {
    const defaultInvite = {
      email: '', name: '',
    };

    const newInviteList = this.state.inviteList;
    newInviteList.push(defaultInvite);
    this.setState({ inviteList: newInviteList });
  }
  removeInvite = (e) => {
    const newInviteList = this.state.inviteList;
    newInviteList.splice(e.target.dataset.index, 1);
    this.setState({ inviteList: newInviteList });
  }
  validateForm = () => {
    const validateListLength = this.state.inviteList.length > 0;
    const validateList = this.state.inviteList.reduce((a, v) =>
      a && v.email.length > 0 && v.name.length > 0, true);
    const validateEmail = this.state.inviteList.reduce((a, v) =>
      a && EmailValidator.validate(v.email), true);

    return validateListLength && validateList && validateEmail;
  }
  enableInviteButton = () => this.props.course.status === 'published'
  render = () => (
    <Row>
      <Collapse isOpen={!this.state.showInviteForm}>
        <Col>
          <Button onClick={this.toggleMenu} disabled={!this.enableInviteButton()}>
            Invite Participants
          </Button>
          {
            this.props.course.status === 'unpublished' ?
              <small className="text-muted ml-2">You can only invite people when the course is published</small> :
              null
          }
        </Col>
      </Collapse>
      <Collapse isOpen={this.state.showInviteForm} className="w-100">
        { this.state.inviteList.map((invitee, i) => (
          <FormGroup className="row" key={i}>
            <Col xs="12" md="5" className="mb-2">
              <Input
                type="email"
                placeholder="email"
                onChange={this.handleChange}
                valid={EmailValidator.validate(invitee.email)}
                data-index={i}
                data-attr="email"
                id="invite"
                value={invitee.email}
              />
            </Col>
            <Col xs="12" md="5" className="mb-2">
              <Input
                type="text"
                placeholder="name"
                onChange={this.handleChange}
                data-index={i}
                data-attr="name"
                id="invite"
                value={invitee.name}
              />
            </Col>
            <Col xs="12" md="2" className="mb-2">
              <Button
                color="danger"
                onClick={this.removeInvite}
                data-index={i}
                disabled={this.state.inviteList.length <= 1}
              >
                <FontAwesome name="minus" />
              </Button>
            </Col>
          </FormGroup>
        ))
        }
        <Col xs="12" className="px-0 mb-2"><Button color="primary" onClick={this.addInvite}><FontAwesome name="plus" /></Button></Col>
        <Col xs="12" className="px-0">
          <Button className="mb-2 mr-2" color="primary" onClick={this.handleSendInvite} disabled={!this.validateForm()}>Send Invite</Button>
          <Button className="mb-2 mr-2" color="danger" onClick={this.toggleMenu}>Cancel</Button>
        </Col>
      </Collapse>
    </Row>
  )
}
