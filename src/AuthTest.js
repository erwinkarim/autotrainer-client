import React, { Component } from 'react';
import { Container, Row, Col, Button, Card, CardText } from 'reactstrap';
import { Auth, API } from 'aws-amplify';
import AWS from 'aws-sdk';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import { decode } from 'jsonwebtoken';

import { federated } from './libs/amp_config';
import { userInfo } from './libs/awsLibs';


// get new cognito idp
const getCognitoClient = () => Auth.currentCredentials()
  .then(credentials => new AWS.CognitoIdentityServiceProvider({ credentials, region: 'ap-southeast-1' }))
  .catch(err => console.log('error getting document client', err));

const getCognitoIdentity = () => Auth.currentCredentials()
  .then(credentials => new AWS.CognitoIdentity({ credentials, region: 'ap-southeast-1' }))
  .catch(err => console.log('error getting identity', err));

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
  getOpenId = async () => {
    const getUser = (token) => {
      getCognitoClient()
        .then((client) => {
          client.getUser({ AccessToken: token }, (err, data) => {
            if (err) {
              console.log('error getting user');
              console.log(err);
            } else {
              console.log('got user');
              console.log(data);
            }
          });
        });
    };

    try {
      // get token
      const cogident = await getCognitoIdentity();
      let token = null;
      await cogident.getOpenIdToken({
        IdentityId: this.state.credential.identityId,
        Logins: {
          'accounts.google.com': this.state.credential.params.Logins['accounts.google.com'],
        },
      }, (err, data) => {
        if (err) {
          console.log('error getting token');
        } else {
          token = data.Token;
          console.log('got token');
          getUser(token);
        }
      });
    } catch (e) {
      console.log('something went wrong');
      console.log(e);
    }
  }
  getCognitoIdent = () => {
    // figure out how to get cognito ident

    getCognitoClient()
      .then((client) => {
        const token = this.state.credential.webIdentityCredentials.params.Logins['accounts.google.com'];
        // console.log('token', token);

        const decodeRes = decode(token);
        console.log('decodeRes', decodeRes);

        client.getUser(
          // { AccessToken: token },
          { AccessToken: '' },
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
  getCognito = () => {
    const getCognito = () => Auth.currentCredentials()
      .then(credentials => new AWS.CognitoIdentity({ credentials, region: 'ap-southeast-1' }))
      .catch(err => console.log('error getting document client', err));

    const getCognitoClient = () => Auth.currentCredentials()
      .then(credentials => new AWS.CognitoIdentityServiceProvider({ credentials, region: 'ap-southeast-1' }))
      .catch(err => console.log('error getting document client', err));

    getCognito()
      .then((cog) => {
        cog.getCredentialsForIdentity({
          IdentityId: this.state.user.id,
          Logins: {
            'accounts.google.com': this.state.credential.webIdentityCredentials.params.Logins['accounts.google.com'],
          },
        }, (err, data) => {
          if (err) {
            this.setState({ cognitoErr: err });
          } else {
            this.setState({ cognitoRes: data });
            getCognitoClient()
              .then((client) => {
                console.log('using access token', this.state.cognitoRes.Credentials.AccessKeyId);

                client.getUser({
                  AccessToken: this.state.cognitoRes.Credentials.SessionToken,
                }, (err2, data2) => {
                  if (err) {
                    this.setState({ cognitoGetErr: err2 });
                  } else {
                    this.setState({ cognitoIdent: data2 });
                  }
                });
              });
          }
        });
      });

    if (this.state.cognitoRes) {
      getCognitoClient()
        .then((client) => {
          console.log('using access token', this.state.cognitoRes.Credentials.AccessKeyId);

          client.getUser({
            AccessToken: this.state.cognitoRes.Credentials.AccessKeyId,
          }, (err, data) => {
            if (err) {
              this.setState({ cognitoGetErr: err });
            } else {
              this.setState({ cognitoIdent: data });
            }
          });
        });
    }
  }
  getUserSession = () => {
    Auth.currentSession()
      .then((res) => {
        this.setState({ sessionRes: res });
      })
      .catch((err) => {
        this.setState({ sessionErr: err });
      });
  }
  getUserInfo = () => {
    console.log('get user info');
    Auth.currentUserInfo()
      .then((res) => {
        this.setState({ userInfoRes: res });
      })
      .catch((err) => {
        this.setState({ userInfoErr: err });
      });
  }
  getUserPoolUser = () => {
    Auth.currentUserPoolUser()
      .then((res) => {
        this.setState({ userPoolRes: res });
      })
      .catch((err) => {
        this.setState({ userPoolErr: err });
      });
  }
  getCurrAuthUser = () => {
    Auth.currentAuthenticatedUser()
      .then((res) => {
        this.setState({ userAuthRes: res });
        if (res.signInUserSession) {
          const decodeResult = decode(res.signInUserSession.accessToken.jwtToken);
          console.log('accessToken', res.signInUserSession.accessToken.jwtToken);
          console.log('decodeResult', decodeResult);
        }
      })
      .catch((err) => {
        this.setState({ userAuthErr: err });
      });
  }
  clearCourse = () => { this.setState({ courses: null }); }
  apiCheck = (e) => {
    const { id } = e.target;
    const token = decode(this.state.credential.params.Logins['accounts.google.com']);

    switch (id) {
      case 'course':
        API.get('default', '/courses')
          .then((response) => { this.setState({ courses: response }); })
          .catch((err) => { console.log(err); });
        break;
      case 'invited':
        API.get('default', '/enrolment/invited', { queryStringParameters: { email: this.state.user.email } })
          .then((response) => { this.setState({ courses: response }); })
          .catch((err) => { console.log(err); });
        break;
      case 'identCheck':
        API.post('default', '/ident/check', { body: { username: `Google_${token.sub}` } })
        // API.post('default', '/ident/check', {})
          .then(() => { this.setState({ courses: 'ok' }); })
          .catch((err) => { console.log(err); });
        break;
      default:
        console.log('unknown target');
    }
  }
  userInfoTest = async () => {
    console.log('invoked user info test');
    /*
    try {
      const result = await userInfo();
      console.log('done await userinfo');
      this.setState({ libUserInfoRes: result });
    } catch (e) {
      this.setState({ libUserInfoErr: e });
    }
    */
    userInfo()
      .then((res) => {
        this.setState({ libUserInfoRes: res });
      });
  }
  logOut = () => {
    Auth.signOut()
      .then(() => {
        this.props.history.push('/');
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
            <CardText>API Check</CardText>
            <CardText>
              <Button className="mr-2" color="primary" id="course" onClick={this.apiCheck}>Load Courses</Button>
              <Button className="mr-2" color="primary" id="invited" onClick={this.apiCheck}>Get Invites</Button>
              <Button className="mr-2" color="primary" id="identCheck" onClick={this.apiCheck}>Ident Check</Button>
              <Button onClick={this.clearCourse}>Clear</Button>
            </CardText>
            <CardText>{ JSON.stringify(this.state.courses)}</CardText>
          </Card>
          <Card body className="mt-2">
            <CardText><Button color="primary" onClick={this.getCognitoIdent}>Get Cognito ident</Button></CardText>
            <CardText>Ident: { JSON.stringify(this.state.cognitoIdent)}</CardText>
            <CardText>Error Msg: {JSON.stringify(this.state.cognitoGetErr)}</CardText>
          </Card>
          <Card body className="mt-2">
            <CardText><Button color="primary" onClick={this.getCognito}>Get Cognito</Button></CardText>
            <CardText>Ident: { JSON.stringify(this.state.cognitoRes)}</CardText>
            <CardText>Error Msg: {JSON.stringify(this.state.cognitoErr)}</CardText>
          </Card>
          <Card body className="mt-2">
            <CardText><Button color="primary" onClick={this.getUserSession}>Get session info</Button></CardText>
            <CardText>session info: { JSON.stringify(this.state.sessionRes) }</CardText>
            <CardText>Error Msg: { JSON.stringify(this.state.sessionErr) }</CardText>
          </Card>
          <Card body className="mt-2">
            <CardText><Button color="primary" onClick={this.getUserInfo}>Get user info</Button></CardText>
            <CardText>session info: { JSON.stringify(this.state.userInfoRes) }</CardText>
            <CardText>Error Msg: { JSON.stringify(this.state.userInfoErr) }</CardText>
          </Card>
          <Card body className="mt-2">
            <CardText><Button color="primary" onClick={this.getUserPoolUser}>Get user pool user</Button></CardText>
            <CardText>session info: { JSON.stringify(this.state.userPoolRes) }</CardText>
            <CardText>Error Msg: { JSON.stringify(this.state.userPoolErr) }</CardText>
          </Card>
          <Card body className="mt-2">
            <CardText><Button color="primary" onClick={this.getCurrAuthUser}>Get Current Authenticated User</Button></CardText>
            <CardText>session info: { JSON.stringify(this.state.userAuthRes) }</CardText>
            <CardText>Error Msg: { JSON.stringify(this.state.userAuthErr) }</CardText>
          </Card>
          <Card body className="mt-2">
            <CardText><Button color="primary" onClick={this.getOpenId}>Get OpenId</Button></CardText>
            <CardText>session info: { JSON.stringify(this.state.userAuthRes) }</CardText>
            <CardText>Error Msg: { JSON.stringify(this.state.userAuthErr) }</CardText>
          </Card>
          <Card body className="mt-2">
            <CardText><Button color="primary" onClick={this.userInfoTest}>User Info Library Test</Button></CardText>
            <CardText>userInfo info: { JSON.stringify(this.state.libUserInfoRes) }</CardText>
            <CardText>Error Msg: { JSON.stringify(this.state.libUserInfoErr) }</CardText>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}


export default withAuthenticator(AuthTest);
