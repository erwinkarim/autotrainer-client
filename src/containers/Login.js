import React, { Component } from "react";
import {Container, Row, Table } from "reactstrap";
import "./Login.css";
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cognitoUser:null,
      cognitoResult:null
    };

  }

  showSignedIn = (session) => {
    document.getElementById("statusNotAuth").style.display = 'none';
    document.getElementById("statusAuth").style.display = 'block';
    document.getElementById("signInButton").innerHTML = "Sign Out";
    if (session) {
      var idToken = session.getIdToken().getJwtToken();
      if (idToken) {
        var payload = idToken.split('.')[1];
        var formatted = JSON.stringify(atob(payload), null, 4);
        document.getElementById('idtoken').innerHTML = formatted;
      }
      var accToken = session.getAccessToken().getJwtToken();
      if (accToken) {
        payload = accToken.split('.')[1];
        formatted = JSON.stringify(atob(payload), null, 4);
        document.getElementById('acctoken').innerHTML = formatted;
      }
      var refToken = session.getRefreshToken().getToken();
      if (refToken) {
        document.getElementById('reftoken').innerHTML = refToken.substring(1, 20);
      }
    }
    this.openTab("userdetails");

  }

  openTab = (tabName) => {
		document.getElementById(tabName).style.display = 'block';
	}

  initCognitoSDK = () => {
    var handle = this;
    var authData = {
			//ClientId : '1pdpd2tbujfndf8fbb4udmh301',
      ClientId : process.env.REACT_APP_COGNITO_APP_ID, // Your client id here
      AppWebDomain : process.env.REACT_APP_APP_WEB_DOMAIN,
      TokenScopesArray : ['email', 'openid','profile'],
      RedirectUriSignIn : `${window.location.protocol}${process.env.REACT_APP_LOCALADDR}/login`,
      RedirectUriSignOut : `${window.location.protocol}${process.env.REACT_APP_LOCALADDR}/logout`

    };
    var auth = new CognitoAuth(authData);
    auth.userhandler = {
      /*
      onSuccess: (result) => {console.log('logged in!!')},
      onFailure: (err) => {console.log(err)}
      */
      onSuccess: function(result) {
        console.log("Sign in success");
        handle.showSignedIn(result);
      },
      onFailure: function(err) {
        console.log("Error!" + err);
      }
    };
    // The default response_type is "token", uncomment the next line will make it be "code".
    // auth.useCodeGrantFlow();
    return auth;
  }

  userButton = (auth) => {
    var state = document.getElementById('signInButton').innerHTML;
    if (state === "Sign Out") {
      document.getElementById("signInButton").innerHTML = "Sign In";
      this.state.cognitoUser.signOut();
      this.showSignedOut();
    } else {
      this.state.cognitoUser.getSession();
    }

  }

  showSignedOut = () => {
    document.getElementById("statusNotAuth").style.display = 'block';
    document.getElementById("statusAuth").style.display = 'none';
    document.getElementById('idtoken').innerHTML = " ... ";
    document.getElementById('acctoken').innerHTML = " ... ";
    document.getElementById('reftoken').innerHTML = " ... ";
    this.closeTab("userdetails");
  }

  closeTab = (tabName) => {
    document.getElementById(tabName).style.display = 'none';
  }

  componentDidMount = () => {
    //begin remove this
    var i, items;
    items = document.getElementsByClassName("tab-pane");
    for (i = 0; i < items.length; i++) {
      items[i].style.display = 'none';
    }
    document.getElementById("statusNotAuth").style.display = 'block';
    document.getElementById("statusAuth").style.display = 'none';
    //end remove this

    // Initiatlize CognitoAuth object
    // need to tell user upstairs that auth has been set
    var curUrl = window.location.href;
    var auth = this.initCognitoSDK();
    this.setState({cognitoUser:auth});
    auth.parseCognitoWebResponse(curUrl);

    //get current cognito user
    //if current user is not null, should automatically get session
    //  otherwise, just intoduce way to login
    var cognitoUser = auth.getCurrentUser();

    if(cognitoUser != null){
      auth.getSession();
      /*
      var session = auth.getSignInUserSession();
      console.log('auth',auth);
      console.log('session', JSON.parse(atob(session.getIdToken().getJwtToken().split('.')[1])) );
      */
      //console.log('auth',auth.signInUserSession.accessToken.jwtToken);
    }

  }

  render() {
    //actually, can remove almost everything
    return (
      <Container className="mt-2">
        <Row>
          <div className="col-12">
            <p id="statusNotAuth" title="Status">
                Sign-In to Continue
            </p>
            <p id="statusAuth" title="Status">
                You have Signed-In
            </p>
          </div>
        </Row>

        <Row>
          <div className="col-12">
          	<div className="tabsWell">
          		<div id="startButtons">
          			<div className="button">
          				<a className="nav-tabs" id="signInButton" title="Sign in" onClick={this.userButton}>Sign In</a>
          			</div>
          		</div>
          		<div className="tab-content">
          			<div className="tab-pane" id="userdetails">
          				<br />
          				<h2 id="usertabtitle">Tokens</h2>
                  <Table responsive>
                    <tbody>
                      <tr id="usertab" className="user-form">
                        <td id="idtoken"> ... </td>
                      </tr>
                      <tr>
                        <td id="acctoken"> ... </td>
                      </tr>
                      <tr>
                        <td id="reftoken"> ... </td>
                      </tr>
                    </tbody>
                  </Table>
          			</div>
          		</div>
          	</div>
          </div>
        </Row>
      </Container>
    );
  }
}
