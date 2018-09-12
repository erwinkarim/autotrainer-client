import React, { Component } from 'react';
import { Container, Row, Col, Button, Card, CardText } from 'reactstrap';
import { Auth, API, Cache } from 'aws-amplify';
import AWS from 'aws-sdk'
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import { federated } from './libs/amp_config';

/**
 * Main App Component
 * @param {int} type The first number.
 * @returns {int} The sum of the two numbers.
 */
class AuthTest extends Component {
  /**
   * Main App Component
   * @param {int} props The props
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { user: null, courses: null };
  }
  componentDidMount = async () => {
    try {
      const newUser = await Auth.currentUserInfo();
      const creds = await Auth.currentCredentials();
      this.setState({ user: newUser, credential: creds });
    } catch (e) {
      console.log(e);
    }

    Auth.currentAuthenticatedUser()
      .then((res) => {
        this.setState({ user: res });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  componentDidUpdate = () => {
    // ask app to check login
    console.log('trigger log in');
    // this.props.triggerLogIn();
  }
  logOut = () => {
    Auth.signOut()
      .then(() => {
        this.props.history.push('/');
      });
  }
  loadCourses = () => {
    API.get('default', '/courses')
      .then((response) => { this.setState({ courses: response }); })
      .catch((err) => { console.log(err); });
  }
  clearCourse = () => { this.setState({ courses: null }); }
  getCognitoIdent = () => {
    const getCognitoClient = () => Auth.currentCredentials()
      .then(credentials => new AWS.CognitoIdentityServiceProvider({ credentials, region: 'ap-southeast-1' }))
      .catch(err => console.log('error getting document client', err));
    // figure out how to get cognito ident

    console.log('federatedInfo', Cache.getItem('federatedInfo'));

    getCognitoClient()
      .then((client) => {
        const token = this.state.credential.webIdentityCredentials.params.Logins['accounts.google.com'];

        client.getUser(
          { AccessToken: token },
          (err, data) => {
            if (err) {
              this.setState({ cognitoGetErr: err });
            } else {
              this.setState({ cognitoIdent: data });
            }
          },
        );
      });
  }
  render = () => (
    <Container className="mt-2" federated={federated}>
      <Row>
        <Col>{JSON.stringify(this.state.user)}</Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mt-2">
            <CardText>User action</CardText>
            <Button color="primary" onClick={this.logOut}>Log out</Button>
          </Card>
          <Card body className="mt-2">
            <CardText>
              <Button color="primary" onClick={this.loadCourses}>Load Courses</Button>
              <Button onClick={this.clearCourse} className="ml-2">Clear</Button>
            </CardText>
            <CardText>{ JSON.stringify(this.state.courses)}</CardText>
          </Card>
          <Card body className="mt-2">
            <CardText><Button color="primary" onClick={this.getCognitoIdent}>Get Cognito ident</Button></CardText>
            <CardText>Ident: { JSON.stringify(this.state.cognitoIdent)}</CardText>
            <CardText>Error Msg: {JSON.stringify(this.state.cognitoGetErr)}</CardText>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}


export default withAuthenticator(AuthTest);
