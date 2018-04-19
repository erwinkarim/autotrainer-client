import React, { Component } from 'react';
import { Row, Col, Button, CardColumns, Card, CardImg, CardBody, CardTitle, CardText, Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import toTitleCase from 'titlecase';
import PropTypes from 'prop-types';
import { invokeApig } from '../../libs/awsLibs';
import config from '../../config';

/**
 * Adds two numbers together.
 * @param {shape} e event
 * @returns {JSX} the common builder
 */
export default class CourseUser extends Component {
  /**
   * Adds two numbers together.
   * @param {shape} props the props
   * @returns {JSX} the common builder
   */
  constructor(props) {
    super(props);
    this.state = { collapse: false };
  }
  toggleMenu = () => {
    this.setState({ collapse: !this.state.collapse });
  }
  handleResendInvite = async () => {
    console.log('should handle resent invite');

    // at this point, userMeta does not exists yet, so userId should hold the
    // email address
    try {
      console.log('attempt to resend invite');
      await this.resendInvite();
      this.props.addNotification(`Resend invite to ${this.props.student.userId}`);
    } catch (e) {
      console.log('error in resending invite');
      console.log(e);
    }
  }
  resendInvite = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    method: 'POST',
    path: `/enrolment/${this.props.course.courseId}/invite`,
    body: {
      inviteList: [{ email: this.props.student.userId, name: this.props.student.userId }],
      meta: { course_owner: this.props.currentUser.name },
    },
  })
  render = () => {
    const modulesAttended = this.props.student.progress === undefined ? 0 :
      this.props.student.progress.length;

    const studentName = this.props.student.userMeta ?
      this.props.student.userMeta.UserAttributes.find(e => e.Name === 'name').Value :
      this.props.student.userId;

    const currentStatus = this.props.student.status ?
      toTitleCase(this.props.student.status) : 'Enrolled';

    const nameStyle = {
      overflow: 'hidden', width: '100%', textOverflow: 'ellipsis', textAlign: 'left',
    };

    return (
      <Row>
        <Col xs="12" md="1">{this.props.index + 1}</Col>
        <Col xs="12" md="5">
          <Button className="p-0" color="link" style={nameStyle} onClick={this.toggleMenu}>{studentName}</Button>
        </Col>
        <Col xs="12" md="3">{modulesAttended} modules</Col>
        <Col xs="12" md="3">{currentStatus}</Col>
        <Collapse isOpen={this.state.collapse} className="col-12 mt-2">
          <CardColumns>
            {
              this.props.student.userMeta ? (
                <Card>
                  <CardImg width="100%" src={this.props.student.userMeta.UserAttributes.find(e => e.Name === 'picture').Value} />
                </Card>
              ) : null
            }
            <Card body>
              <CardText>Enrolled at {(new Date(this.props.student.createdAt)).toLocaleString('en-us', { day: 'numeric', month: 'long', year: 'numeric' })}</CardText>
            </Card>
            <Card>
              <CardBody>
                <CardTitle>Progress</CardTitle>
                <CardText>{modulesAttended} modules completed</CardText>
              </CardBody>
              <ListGroup flush>
                { this.props.modules.map(m => (
                  <ListGroupItem key={m.moduleId}>
                    {
                      this.props.student.progress.includes(m.moduleId) ?
                        (<strike>{m.title}</strike>) : m.title
                    }
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card>
            <Card body>
              <CardTitle>Status</CardTitle>
              <CardText>{currentStatus}</CardText>
              { currentStatus === 'Invited' ? <Button size="sm" onClick={this.handleResendInvite}>Resend Invite</Button> : null }
            </Card>
            {
              this.props.student.certId ? (
                <Card body>
                  <CardTitle>Cert Issued</CardTitle>
                  <CardText><Link href="/" to={`/verify_cert?certNo=${this.props.student.certId}`}>{ this.props.student.certId }</Link></CardText>
                  <CardText>Issued {(new Date(this.props.student.certIssued)).toLocaleString('en-us', { day: 'numeric', month: 'long', year: 'numeric' })}</CardText>
                </Card>

              ) : null
            }
          </CardColumns>
        </Collapse>
        <Col xs="12"><hr /></Col>
      </Row>
    );
  }
}

CourseUser.propTypes = {
  index: PropTypes.number.isRequired,
  addNotification: PropTypes.func.isRequired,
  student: PropTypes.shape().isRequired,
  currentUser: PropTypes.shape().isRequired,
  course: PropTypes.shape().isRequired,
  modules: PropTypes.shape().isRequired,
};
