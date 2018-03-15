import React, { Component } from "react";
//import AWS from 'aws-sdk';
import { Container, Row, Col } from 'reactstrap';

export default class About extends Component{
  render(){
    return (<Container className="mt-2">
      <Row>
        <Col xs="12">
          <h2>Our Team</h2>
          <table className="table">
            <tbody>
              <tr>
                <td><img src="http://placehold.it/64x64" className="rounded-circle" alt="Malek Erwin"/> Malek Erwin</td>
                <td><img src="http://placehold.it/64x64" className="rounded-circle" alt="Khairul Izad"/> Khairul Izad</td>
                <td><img src="http://placehold.it/64x64" className="rounded-circle" alt="Penny Cheok"/> Penny Cheok </td>
              </tr>
              <tr>
                <td colSpan="3"><img src="http://placehold.it/64x64" className="rounded-circle" alt="Hamadah Othman"/> Hamadah Othman</td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </Container>);

  }
}