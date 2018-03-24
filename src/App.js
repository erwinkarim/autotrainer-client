import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Alert, Button } from 'reactstrap';
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
import FontAwesome from 'react-fontawesome';
import randomInt from 'random-int';
import Routes from './Routes';
import MainNav from './containers/MainNav';
import { getAwsCredentials } from './libs/awsLibs';
import config from './config';
import './App.css';

/**
 * Main App Component
 * @param {int} authenticated The first number.
 * @param {int} id The first number.
 * @param {int} type The first number.
 * @param {int} message The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */
class App extends Component {
  /**
   * Main App Component
   * @param {int} props The first number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);

    this.state = {
      announceIsVisible: true,
      isAuthenticated: false,
      isAuthenticating: false,
      currentUser: null,
      auth: null,
      notifications: OrderedSet(),
    };
  }
  componentDidMount = async () => {
    const handle = this;
    const curUrl = window.location.href;

    // check for current user, if there is stored in storage, loaded and sign up
    this.setState({ isAuthenticating: true });
    const auth = this.initCognitoSDK();
    auth.parseCognitoWebResponse(curUrl);
    handle.setState({ auth });

    const currentUser = auth.getCurrentUser();
    if (currentUser != null) {
      auth.getSession();
    }
  }
  dismissAnnouncement = () => { this.setState({ announceIsVisible: false }); }
  userHasAuthenticated = (authenticated) => {
    this.setState({ isAuthenticated: authenticated, isAuthenticating: false });
  }
  initCognitoSDK = () => {
    const handle = this;
    const authData = {
      ClientId: process.env.REACT_APP_COGNITO_APP_ID, // Your client id here
      AppWebDomain: process.env.REACT_APP_APP_WEB_DOMAIN,
      TokenScopesArray: ['email', 'openid', 'profile'],
      RedirectUriSignIn: `${window.location.protocol}//${window.location.host}/welcome`,
      RedirectUriSignOut: `${window.location.protocol}//${window.location.host}/logout`,
    };
    const auth = new CognitoAuth(authData);
    // got the refresh token for this, but doesn't process fast enough when logging in
    auth.useCodeGrantFlow();
    auth.userhandler = {
      /*
      onSuccess: (result) => {console.log('logged in!!')},
      onFailure: (err) => {console.log(err)}

      */
      async onSuccess(result) {
        // get the user
        const user = JSON.parse(atob(result.idToken.jwtToken.split('.')[1]));
        await getAwsCredentials(result.idToken.jwtToken);
        await handle.setState({ currentUser: user });

        // everything done, then tell user is authenticated
        handle.userHasAuthenticated(true);
        return true;
      },
      onFailure(err) {
        console.log(`Error: ${err}`);
        // attempt to clear all local storage
        window.localStorage.clear();
        handle.userHasAuthenticated(false);
        return false;
      },
    };
    // The default response_type is "token", uncomment the next line will make it be "code".
    // auth.useCodeGrantFlow();
    return auth;
  }
  addNotification = (message = 'Default message', type = 'success') => {
    // const newCount = count + 1;
    const id = randomInt(1000);
    return this.setState({
      notifications: this.state.notifications.add({
        message: `${message}`,
        key: id,
        action: <FontAwesome name="times" />,
        actionStyle: { color: 'white' },
        dismissAfter: 3412,
        className: `bg-${type}`,
        onClick: (notification, deactivate) => { deactivate(); this.removeNotification(id); },
      }),
    });
  }
  removeNotification = (id) => {
    this.setState({
      notifications: this.state.notifications.filter(n => n.key !== id),
    });
  }
  /**
   * Main App Component
   * @param {int} authenticated The first number.
   * @param {int} id The first number.
   * @returns {int} The sum of the two numbers.
   */
  render() {
    const childProps = {
      ...this.state,
      ...{ addNotification: this.addNotification, removeNotification: this.removeNotification },
    };

    const topBanner = (
      <Alert
        color="primary"
        className="text-left mb-0"
        isOpen={this.state.announceIsVisible}
        toggle={this.dismissAnnouncement}
        style={{ paddingRight: '4rem' }}
      >
        { config.banner.text }
        {
          config.banner.showButton ? (
            <Button outline color="primary" className="ml-2" tag={Link} to={config.banner.buttonLink}>{config.banner.buttonText}</Button>
          ) : null
          }
      </Alert>
    );

    return (
      <div className="App">
        { topBanner }
        <MainNav {...this.state} />
        <Routes childProps={childProps} />
        <NotificationStack
          notifications={this.state.notifications.toArray()}
          onDismiss={
            notification => this.setState({
              notifications: this.state.notifications.delete(notification),
            })
          }
        />
        <footer className="footer text-muted">
          <Container>
            <p>
              &copy; 2017-2018 learn@AP. All rights reserved &bull; {' '}
              <Link href="/" to="/legal">Terms of Use and Privacy Policy</Link> &bull; {' '}
              <Link href="/" to="/contact">Contact</Link> &bull; {' '}
              <Link href="/" to="/verify_cert">Verify Certificate</Link> &bull; {' '}
              <Link href="/" to="/about">About</Link> &bull; {' '}
              <Link href="/" to="/team">Team</Link>
            </p>
          </Container>
        </footer>
      </div>
    );
  }
}

export default App;
