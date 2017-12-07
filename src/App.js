import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Routes from "./Routes";
import { Alert, Button } from 'reactstrap';
import { Container } from 'reactstrap';
//import RouteNavItem from './components/RouteNavItem';
import MainNav from './containers/MainNav';
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import './App.css';
import {getAwsCredentials } from './libs/awsLibs'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      announceIsVisible: true,
      isAuthenticated:false,
      currentUser:null,
      auth:null
    };
  }
  dismissAnnouncement = () => {this.setState({announceIsVisible:false})}
  componentDidMount = () => {
    var handle = this;

    //check for current user, if there is stored in storage, loaded and sign up
    //var auth = this.initCognitoSDK();
    var auth = this.initCognitoSDK();
    handle.setState({auth:auth});
    var currentUser = auth.getCurrentUser();
    if(currentUser != null){
      //TODO: use AWS credentials to refresh token??
      auth.getSession()
    }

  }
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }
  initCognitoSDK = () => {
    var handle = this;
    var authData = {
			//ClientId : '1pdpd2tbujfndf8fbb4udmh301',
      ClientId : process.env.REACT_APP_COGNITO_APP_ID, // Your client id here
      AppWebDomain : process.env.REACT_APP_APP_WEB_DOMAIN,
      TokenScopesArray : ['email', 'openid','profile'],
      RedirectUriSignIn : `${window.location.protocol}//${window.location.host}/login`,
      RedirectUriSignOut : `${window.location.protocol}//${window.location.host}/logout`
    };
    var auth = new CognitoAuth(authData);
    auth.userhandler = {
      /*
      onSuccess: (result) => {console.log('logged in!!')},
      onFailure: (err) => {console.log(err)}

      */
      onSuccess: async function(result) {
        console.log("Sign in success");
        handle.setState({currentUser:JSON.parse(atob(result.idToken.jwtToken.split('.')[1])) });
        handle.userHasAuthenticated(true);
        getAwsCredentials(result.idToken.jwtToken);
        return true;
      },
      onFailure: function(err) {
        console.log("Error!" + err);
        handle.userHasAuthenticated(false);
        return false;
      }
    };
    // The default response_type is "token", uncomment the next line will make it be "code".
    // auth.useCodeGrantFlow();
    return auth;
  }
  render() {
    const childProps = {
      ...this.state
    };

    return (
      <div className="App">
        <Alert color="primary" className="mb-0 text-left" isOpen={this.state.announceIsVisible} toggle={this.dismissAnnouncement}>
          Announcement Here !!!
          <Button outline color="primary" className="ml-2">Register Now</Button>
        </Alert>
        <MainNav {...this.state} />
        <Routes childProps={childProps} />
        <footer className="footer text-muted">
          <Container>
            <p>
              &copy; AutoTrainer 2017 &bull; <Link to="/legal">Legal</Link> &bull; <Link to="/contact">Contact</Link>
            </p>
          </Container>
        </footer>
      </div>
    );
  }
}

export default App;
