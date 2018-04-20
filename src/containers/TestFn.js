import React, { Component } from 'react';
import { Container, Row, Col, Button, Card, CardText } from 'reactstrap';
import config from '../config';
import { invokeApig, getUnauthCredentials } from '../libs/awsLibs';
// import Notice from '../components/Notice';

/**
 * a container to invoke module test gateway
 * @param {shape} props the auth object
 * @returns {boolean} The use is authenticated or not
 */
export default class TestFn extends Component {
  /**
   * a container to invoke module test gateway
   * @param {shape} props the auth object
   * @returns {boolean} The use is authenticated or not
   */
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }
  generateAnonUser = async () => {
    // attempt to generate unauth user in the identity pool
    try {
      await getUnauthCredentials();
    } catch (e) {
      console.log('something went wrong');
      console.log(e);
    }
  }
  handleClick = async () => {
    try {
      // if unautheticated, try to generate one
      console.log('testing for local credentials');
      await this.generateAnonUser();


      // try to rest current expiration time
      this.setState({ loading: true });

      console.log(`${Date.now()}: Start invoking`);
      await this.invokeTest();
      console.log(`${Date.now()}: Done invoking`);

      this.setState({ loading: false });
    } catch (e) {
      console.log(`${Date.now()}: error invoking test`);
      console.log(e);
      this.setState({ loading: false });
    }
  }
  invokeTest = () => invokeApig({
    endpoint: config.apiGateway.MODULE_URL,
    path: '/modules/test',
  })
  render = () => {
    // applicable to admins only;
    /*
    if (this.props.currentUser === null) {
      return <Notice content="user not logged in" />;
    }

    if (!this.props.currentUser['cognito:groups'].includes('admin')) {
      return <Notice content="for admins only" />;
    }
    */

    return (
      <Container className="mt-2">
        <Row>
          <Col>
            <Card body>
              <CardText><Button color="primary" disabled={this.state.loading} onClick={this.handleClick}>Invoke Test</Button></CardText>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
