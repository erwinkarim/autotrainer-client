import Amplify from 'aws-amplify';
import awsExports from '../aws-exports';

export const federated = {
  google_client_id: process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID,
  facebook_app_id: '',
  amazon_client_id: '',
};

const AuthSpec = {
  // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
  // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
  identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,

  // REQUIRED - Amazon Cognito Region
  region: 'ap-southeast-1',

  // OPTIONAL - Amazon Cognito Federated Identity Pool Region
  // Required only if it's different from Amazon Cognito Region
  // identityPoolRegion: 'XX-XXXX-X',

  // OPTIONAL - Amazon Cognito User Pool ID
  userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,

  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  userPoolWebClientId: process.env.REACT_APP_COGNITO_APP_ID,

  // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
  mandatorySignIn: false,

  // OPTIONAL - Configuration for cookie storage
  /*
  cookieStorage: {
    // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    domain: '.actuarialpartners.com',
    // OPTIONAL - Cookie path
    path: '/',
    // OPTIONAL - Cookie expiration in days
    expires: 365,
    // OPTIONAL - Cookie secure flag
    secure: true,
  },
  */

  // OPTIONAL - customized storage object
  // storage: new MyStorage(),

  // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
  authenticationFlowType: 'USER_SRP_AUTH',

  // oauth: oauthSpec,
};

const configureAmp = () => {
  Amplify.configure(awsExports);
  Amplify.configure({
    Auth: AuthSpec,
  });
};

export default configureAmp;
