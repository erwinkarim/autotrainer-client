import React, { Component } from 'react';
import {Container, Row} from 'reactstrap';
import './Contact.css'

export default class Contact extends Component {
  render(){
    return (<Container>
      <Row>
        <div className="col-12">Some form which will connect to a lambda function here</div>
      </Row>
    </Container>)
  }
}
