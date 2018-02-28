import React, { Component } from "react";
import {Container, Row, Col, FormGroup, Input, Button } from "reactstrap";
import Notice from '../components/Notice';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';
import './CertCheck.css';

/*
  display the cert
  TODO: make this more responsive (looks good in desktop, ipad, phone)
*/
class Cert extends Component {
  constructor(props){
    super(props);
    this.state = { dateHandle: new Date(this.props.cert.certIssued)};
  }
  render = () => {
    return (
      <div className="cert cert-background d-flex align-items-center justify-content-center flex-column">
        <div className="py-4"><h2>CERTIFICATE OF COMPLETION</h2></div>
        <div className="cert-text py-4">This certified that</div>
        <div className="pb-4">{this.props.cert.actualname}</div>
        <div className="cert-text pb-4">has completed the short course entitled</div>
        <div className="pb-4"><strong>{this.props.cert.coursename.toUpperCase()}</strong></div>
        <div className="pb-4"><img src="/logos/learn.part1.png" alt="learn@AP" /></div>
        <div className="w-80 d-flex justify-content-between  pb-4">
          <span className="cert-text cert-text-border col-4 pt-4"><small>{this.props.cert.certId}</small></span>
          <span className="col-4"></span>
          <span className="cert-text cert-text-border col-4 pt-4">{`${this.state.dateHandle.toLocaleString('en-us', {day:'numeric', month:'long', year:'numeric'})}`}</span>
        </div>
      </div>
    )
  }
}

Cert.defaultProps = {
  cert: { actualname:'FirstName LastName', coursename:'The CourseName', courseowner:'CourseOwner', certIssued:Date.now()}
}

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
                    <Cert cert={this.state.cert} /> :
                    ( <Notice content={`Certificate ${this.state.certNo} not found ...`} />) :
                  null

            }
          </Col>
        </Row>
      </Container>
    )

  }
}
