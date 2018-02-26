import React, { Component } from "react";
import {Container, Row, Col, FormGroup, Input, Button } from "reactstrap";
import { Card, CardTitle, CardText } from 'reactstrap';
import Notice from '../components/Notice';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';

export default class CertCheck extends Component {
  constructor(props){
    super(props);
    this.state = {
      certNo: '', cert:null,
      checking:false, checked:false, found: false
    }
  }
  handleCheckCert = async (e) => {
    this.setState({checking:true, found:false});
    try {
      var result = await this.checkCert();
      if(result){
        this.setState({found:true, cert:result});
      }

    } catch(e) {
      console.log('error cert lookup');
      console.log(e)
    };

    //always happens
    this.setState({checking:false, checked:true});

  }
  checkCert = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      method: 'POST',
      path: '/enrolment/cert_lookup',
      queryParams: {certId:this.state.certNo}
    });
  }
  enableBtn = () => {
    return this.state.certNo.length > 0 || !this.state.checking;
  }
  render(){
    //check if authenticated
    if(this.props.currentUser === null){
      return (<Notice title="Unauthenticated" content="Please log in to verify certificate"/>);
    }

    return (
      <Container className="mt-3">
        <Row>
          <Col xs="12" className="text-left">
            <h3>Verify a Certificate</h3>
            <p>All certificates issued by learn@AP has a unique identification number</p>
            <p>To verify a certificate, please key in the ID number below</p>
          </Col>
          <Col xs="12">
            <FormGroup>
              <Input type="text" placeholder="Certificate No."
                value={this.state.certNo} onChange={ (e) => { this.setState({certNo:e.target.value, found:false, checked:false}) }}
              />
            </FormGroup>
            <p className="text-center">
              <Button color="primary" onClick={this.handleCheckCert} disabled={ !this.enableBtn()}>
                { this.state.checking ? 'Checking' : 'Check'}
              </Button>
            </p>
          </Col>
          <Col xs="12">
            {
              this.state.checking ?
                (<Notice content={`Checking certificate ${this.state.certNo} ...`} />) :
                this.state.checked ?
                  this.state.found ?
                    (
                      <Card body>
                        <CardTitle>{this.state.cert.certId}</CardTitle>
                        <CardText>
                          {this.state.cert.actualname} <small>has attended</small> {this.state.cert.coursename}
                        </CardText>
                        <CardText><small>between</small></CardText>
                        <CardText>
                          {(new Date(this.state.cert.createdAt)).toString()} <small>and </small>
                          {(new Date(this.state.cert.certIssued)).toString()}
                        </CardText>
                      </Card>
                    ) :
                    ( <Notice content={`Certificate ${this.state.certNo} not found ...`} />) :
                  null

            }
          </Col>
        </Row>
      </Container>
    )

  }
}
