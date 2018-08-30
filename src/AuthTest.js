import React, { Component } from 'react';
import { Container, Row, Col, Button, Card, CardText } from 'reactstrap';
import { Auth, API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import { federated } from './libs/amp_config';

/**
 * Main App Component
 * @param {int} type The first number.
 * @returns {int} The sum of the two numbers.
 */
class AuthTest extends Component {
  /**
   * Main App Component
   * @param {int} props The props
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { user: null, courses: null, };
  }
  componentDidMount = async () => {
    try {
      const newUser = await Auth.currentAuthenticatedUser();
      this.setState({ user: newUser });
    } catch (e) {
      console.log(e);
    }
  }
  logOut = () => {
    Auth.signOut()
      .then(() => {
        this.props.history.push('/');
      });
  }
  loadCourses = () => {
    API.get('default', '/courses')
      .then((response) => { this.setState({ courses: response }); })
      .catch((err) => { console.log(err); });
  }
  render = () => (
    <Container className="mt-2">
      <Row>
        <Col>{JSON.stringify(this.state.user)}</Col>
      </Row>
      <Row>
        <Col className="mb-2"><Button color="primary" onClick={this.logOut}>Log out</Button></Col>
        <Col xs={12}>
          <Card body>
            <CardText><Button color="primary" onClick={this.loadCourses}>Load Courses</Button></CardText>
            <CardText>{ JSON.stringify(this.state.courses)}</CardText>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default withAuthenticator(AuthTest, null, [], federated);
