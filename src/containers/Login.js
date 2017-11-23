import React, { Component } from "react";
import {Container, CardText, Card, CardBody } from "reactstrap";
import GoogleLogin from 'react-google-login';
import AWS from 'aws-sdk';
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };

  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  login(email, password) {
    console.log('should login here');
  }

  responseGoogle = (response) => {
    console.log(response);

    //get the token from google
    var id_token = response.getAuthResponse().id_token;

    //setup the credentials
    /*
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
     IdentityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
     Logins: { 'accounts.google.com': id_token }
    });
    */

    AWS.config.region = 'ap-southeast-1';
    var cognitoidentity = new AWS.CognitoIdentity({region:'ap-southeast-1'});

    var params = {
      IdentityPoolId : process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID, // your identity pool id here
      Logins: { 'accounts.google.com': id_token }
    }
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

    console.log('AWS.config.credentials', AWS.config.credentials);

    //should put in promises so not to mess things up
    // getId
    cognitoidentity.getId(
      params, (err,data) => {
        if (err) console.log(err, err.stack); // an error occurred
        else {
           console.log('getId', data);           // successful response

        }
      }
    );

    // getCredentialsforIdentity
    // should get session token to do stuff
    /*
    cognitoidentity.getCredentialsForIdentity(
      AWS.config.credentials, (err,data)=>{
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log('getCredentialsForIdentity', data);           // successful response
      }
    );
    */
  }

  render() {
    console.log('render credentials', AWS.config.credentials);
    return (
      <Container className="mt-2">
        <div className="col-12 col-md-8">
          <Card className="Login">
            <CardBody>
              <CardText>
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
                  onSuccess={this.responseGoogle} onFailure={this.responseGoogle}
                />
              </CardText>
            </CardBody>
          </Card>
        </div>
      </Container>
    );
  }
}
