import React from 'react';
import { Container, Row, Col, Card, CardTitle, CardText, Button } from 'reactstrap';
import PropTypes from 'prop-types';

const LoginBox = (props) => {
  if (props.currentUser !== null) {
    return null;
  }

  const handleLogin = () => {
    // store current location into localstorege
    window.localStorage.setItem('login_redirect', window.location.pathname);

    props.auth.getSession();
  };

  return (
    <Container className="mt-2 mb-3">
      <Row>
        <Col>
          <Card body>
            <CardTitle>Login</CardTitle>
            <CardText>Please login to complete the action</CardText>
            <Button color="primary" onClick={handleLogin}>Login</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

LoginBox.propTypes = {
  currentUser: PropTypes.shape().isRequired,
  auth: PropTypes.shape().isRequired,
};

export default LoginBox;
