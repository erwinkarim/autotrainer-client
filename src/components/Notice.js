import React, { Component } from "react";
import {Container, Row, Col, Card, CardBody, CardTitle, CardText} from 'reactstrap';

export default class Notice extends Component {
  defaultProps = {
    title:'', content: 'No content'
  }
  render(){
    return (<Container className="mt-3">
      <Row>
        <Col>
          <Card>
            <CardBody>
              { this.props.title !== '' ? ( <CardTitle>{this.props.title}</CardTitle> ) : null }
              <CardText>{this.props.content}</CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>);
  }
}
