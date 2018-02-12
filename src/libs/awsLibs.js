//import AWS from 'aws-sdk'
import AWS from 'aws-sdk/global'
import S3 from 'aws-sdk/clients/s3';
//import CognitoIdentityCredentials from 'aws-sdk/lib/credentials/cognito_identity_credentials';
import sigV4Client from "./sigV4Client";
import config from '../config.js'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

export async function authUser() {
  //console.log('authUser: check Credentials');
  if (
    AWS.config.credentials &&
    Date.now() < AWS.config.credentials.expireTime - 60000
  ) {
    //console.log('authUser: credentials is valid');
    return true;
  }


  //console.log('authUser: initCognitoSDK and getCurrentUser');
  //console.log('attempt to rebuild session');
  var auth = initCognitoSDK();
  var curUrl = window.location.href;

  auth.parseCognitoWebResponse(curUrl);
  const currentUser = auth.getCurrentUser();
  //const currentUser = getCurrentUser();

  if (currentUser === null) {
    console.log('authUser: user is null');
    return false;
  }

  //const userToken = await getUserToken(currentUser);
  //console.log('authUser: getUserToken');
  const userToken = await getUserToken(auth);

  //console.log('authUser: getAwsCredentials');
  await getAwsCredentials(userToken);

  return true;
}

async function getUserToken(auth) {
  // replace this w/ something from cognito
  try {
    await auth.getSession();
    if(Date.now() > AWS.config.credentials.expireTime - 6000 || AWS.config.credentials.expireTime === false){
      //console.log('session expired, force refresh');
      try{
        await auth.refreshSession(auth.signInUserSession.refreshToken.refreshToken)
        //console.log('done refreshing token');
        //console.log('getUserToken: AWS.credentials', AWS.config.credentials);
        //console.log('auth.signInUserSession', auth.signInUserSession);
      } catch(e){
        console.log('error refreshing token inside getUserToken');
        console.log(e);
      }
    }
  } catch(e){
    //console.log(e);
    return ('failed to get user session');
  };

  return auth.signInUserSession.idToken.jwtToken;
}

export function initCognitoSDK(){
  var authData = {
		//ClientId : '1pdpd2tbujfndf8fbb4udmh301',
    ClientId : process.env.REACT_APP_COGNITO_APP_ID, // Your client id here
    AppWebDomain : process.env.REACT_APP_APP_WEB_DOMAIN,
    TokenScopesArray : ['email', 'openid','profile'],
    RedirectUriSignIn : `${window.location.protocol}//${window.location.host}/welcome`,
    RedirectUriSignOut : `${window.location.protocol}//${window.location.host}/logout`
  };
  var auth = new CognitoAuth(authData);
  auth.useCodeGrantFlow();
  auth.userhandler = {
    /*
    onSuccess: (result) => {console.log('logged in!!')},
    onFailure: (err) => {console.log(err)}

    */
    onSuccess: async function(result) {
      //console.log("Sign in success");
      //handle.setState({currentUser:JSON.parse(atob(result.idToken.jwtToken.split('.')[1])) });
      //handle.userHasAuthenticated(true);
      //console.log('onSuccess credentials', AWS.config.credentials);
      getAwsCredentials(result.idToken.jwtToken);
      //console.log('onSuccess after getAwsCredentials', AWS.config.credentials);
      return true;
    },
    onFailure: function(err) {
      //console.log("Error!" + err);
      //handle.userHasAuthenticated(false);
      return false;
    }
  };

  return auth;
}

export async function getAwsCredentials(userToken) {
  //const authenticator = `cognito-idp.ap-southeast-1.amazonaws.com/${config.cognito.USER_POOL_ID}`;
  const authenticator = `cognito-idp.ap-southeast-1.amazonaws.com/${process.env.REACT_APP_COGNITO_USER_POOL_ID}`;

  AWS.config.update({ region: 'ap-southeast-1'});

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
    IdentityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
    Logins: {
      [authenticator]: userToken
    }
  });

  return AWS.config.credentials.getPromise();
}

export async function s3Upload(file) {
  if (!await authUser()) {
    throw new Error("User is not logged in");
  }

  const s3 = new S3({
    region: config.apiGateway.REGION,
    params: {
      Bucket: process.env.REACT_APP_S3_BUCKET
    }
  });
  const filename = `${AWS.config.credentials.identityId}/${Date.now()}-${file.name}`;

  return s3
    .upload({
      Key: filename,
      Body: file,
      ContentType: file.type,
      ACL: "public-read"
    })
    .promise();
};

export async function s3Delete(file){
  if (!await authUser()) {
    throw new Error("User is not logged in");
  }

  console.log(`attempt to delete ${file}`);

  const s3 = new S3({
    region: config.apiGateway.REGION,
    params: {
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: file
    }
  });

  return s3
    .deleteObject().promise();
}

// TODO: invoke w/o authenticated credentials for certain functions (eg. get courses info)
export async function invokeApig({ path, endpoint = config.apiGateway.URL , method = "GET", headers = {}, queryParams = {}, body }) {

  //should handle this, ensure user is authenticated before proceeding
  if (!await authUser()) {
    throw new Error("User is not logged in");
  }

  if(!AWS.config.credentials){
    console.log('invokeApig: credentials are empty despite await');
  };

  //console.log('invokeApig: AWS.config.credentials', AWS.config.credentials);
  //console.log('invokeApig: new signedRequest');
  const signedRequest = sigV4Client
    .newClient({
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: config.apiGateway.REGION,
      endpoint: endpoint
      //endpoint: config.apiGateway.URL
    })
    .signRequest({
      method,
      path,
      headers,
      queryParams,
      body
    });

  body = body ? JSON.stringify(body) : body;
  headers = signedRequest.headers;

  const results = await fetch(signedRequest.url, {
    method,
    headers,
    body
  });

  if (results.status !== 200) {
    throw new Error(await results.text());
  }

  return results.json();
}

/*
function getCurrentUser() {
  //replace this w/ something about cognito-auth-js
  // setup CognitoAuth and get current user and session??
  /*
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  return userPool.getCurrentUser();
}
*/

/*
Get Unauthenticated Credeitnails from the ID Pool
The ID pool need to enabled Unauthenticated access
async function getUnauthCredentials(){
  AWS.config.region = 'ap-southeast-1'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'ap-southeast-1:d305ce7d-b107-480b-93cd-a4c0c9881a42'
  });
  await AWS.config.credentials.getPromise();
}
*/

/*
  TODO: figure out how use the refresh token
*/
