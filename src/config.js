export default {
  site_name: 'learn@AP',
  MAX_ATTACHMENT_SIZE: 5000000,
  apiGateway: {
    URL: 'https://api.learn.actuarialpartners.com',
    MODULE_URL: 'https://api.learn.actuarialpartners.com',
    ENROLMENT_URL: 'https://api.learn.actuarialpartners.com',
    IDENT_URL: 'https://api.learn.actuarialpartners.com',
    MISC_URL: 'https://api.learn.actuarialpartners.com',
    REGION: 'ap-southeast-1',
  },
  cognito: {
    REGION: 'ap-southeast-1',
    IDENTITY_POOL_ID: 'ap-southeast-1:d305ce7d-b107-480b-93cd-a4c0c9881a42',
    USER_POOL_ID: 'YOUR_COGNITO_USER_POOL_ID',
    APP_CLIENT_ID: 'YOUR_COGNITO_APP_CLIENT_ID',
  },
  banner: {
    displayBanner: false,
    text: 'IFRS17 Series of Workshops, 23 – 25 April 2018, Istana Hotel, Kuala Lumpur',
    showButton: false,
    buttonText: 'Register Now !',
    buttonLink: '/courses',
  },
  tutorial: {
    // default ids for course, docs, etc ...
    course: '89ebe1d0-7aa5-11e8-8792-63f412a9d068',
    article: 'a77f2400-7aa5-11e8-b1bf-71d0e417bcc2',
    doc: 'cce5fad0-7e69-11e8-91a3-0983c401d897',
    quiz: '1fa1d720-7aa6-11e8-b1bf-71d0e417bcc2',
  },
};
