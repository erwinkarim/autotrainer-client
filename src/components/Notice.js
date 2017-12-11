import React, { Component } from "react";
import {Container, Row, Col, Card, CardBody, CardTitle, CardText} from 'reactstrap';

export default class Notice extends Component {
  render(){
    return (<Container className="mt-3">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>Test Title</CardTitle>
              <CardText>Test content</CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>);
  }
}
