import React, { Component } from "react";
import {Container, Row, CardText, Card, CardBody } from "reactstrap";

export default class Logout extends Component {
  render(){
    return (<Container className="mt-2">
      <Row>
        <div className="col-12 col-8-md">
          <Card>
            <CardBody>
              <CardText>You have successfully logged out.</CardText>
            </CardBody>
          </Card>
        </div>
      </Row>
    </Container>);
  }
}
