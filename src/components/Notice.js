import React, { Component } from "react";
import {Container, Row, Col, Card, CardBody, CardTitle, CardText} from 'reactstrap';

export default class Notice extends Component {
  render(){
    return (<Container className="mt-3 mb-2">
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

Notice.defaultProps = {
    title:'', content: 'No content'
}
