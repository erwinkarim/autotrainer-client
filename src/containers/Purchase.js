/**
 * setup payment via Adyen. since this is quite expensive unless you have the
  transaction volume, will revisit this later
 */
import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import 'whatwg-fetch';

/*
const adyenEncrypt = require('adyen-cse-web');

const key = process.env.REACT_APP_ADYEN_PUBLIC_KEY;
const options = {};
const cseInstance = adyenEncrypt.createEncryption(key, options);
const postData = {};
const currentDate = new Date();

postData['card.encrypted.json'] = cseInstance.encrypt({
  number: '4111111111111111',
  cvc: '737',
  holderName: 'Test Data',
  expiryMonth: '08',
  expiryYear: '2018',
  generationtime: currentDate.toISOString(),
});

console.log('postData', postData);

const adyenUser = process.env.REACT_APP_ADYEN_USER;
const adyenPass = process.env.REACT_APP_ADYEN_PASS;
const requestPayment = () => fetch('https://pal-test.adyen.com/pal/servlet/Payment/v30/authorise', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`${adyenUser}:${adyenPass}`)}`,
  },
  body: JSON.stringify({
    additionalData: postData,
    amount: {
      value: 2000,
      currency: 'EUR',
    },
    reference: 'Your reference',
    merchantAccount: 'APAccount879 Company',
  }),
});

const handleClick = async () => {
  console.log('clicked');
  try {
    const result = await requestPayment();
    console.log('result', result);
  } catch (e) {
    console.log('error requesting payment');
    console.log(e);
  }
};


const Purchase = () => (
  <Container className="mt-2">
    <Row>
      <Col xs="12">
        <h2>Purchase Test</h2>
      </Col>
      <Col><Button onClick={handleClick}>Adyen Test!</Button></Col>
      <Col><Button>MOL Pay Test</Button></Col>
    </Row>
  </Container>
);
*/

const Purchase = () => (
  <Container className="mt-2">
    <Row>
      <Col xs={12}>Payment test of the future</Col>
    </Row>
  </Container>
);

export default Purchase;
