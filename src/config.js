export default {
  MAX_ATTACHMENT_SIZE: 5000000 ,
  apiGateway: {
    URL: "https://iuwoyhr5oi.execute-api.ap-southeast-1.amazonaws.com/prod",
    MODULE_URL: "https://ltqs221b5i.execute-api.ap-southeast-1.amazonaws.com/prod",
    ENROLMENT_URL: "https://cq7fci2enb.execute-api.ap-southeast-1.amazonaws.com/prod",
    REGION: "ap-southeast-1"
  },
  cognito: {
    REGION: "ap-southeast-1",
    IDENTITY_POOL_ID: "ap-southeast-1:d305ce7d-b107-480b-93cd-a4c0c9881a42",
    USER_POOL_ID: "YOUR_COGNITO_USER_POOL_ID",
    APP_CLIENT_ID: "YOUR_COGNITO_APP_CLIENT_ID"
  },
  banner: {
    text:'Course Promo Text',
    buttonText:'Register Now !',
    buttonLink:'/courses'
  }
};
