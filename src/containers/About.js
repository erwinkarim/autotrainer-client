import React, { Component } from "react";
//import AWS from 'aws-sdk';
import { Container, Row, Col } from 'reactstrap';

export default class About extends Component{
  render(){
    return (<Container>
      <Row>
        <Col xs="12">
          <h2>About page</h2>
          <p>Talk about the site here</p>
        </Col>
      </Row>
    </Container>);

  }
}
