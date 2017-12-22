import React, { Component } from 'react';
import {Container, Row, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import {Card, CardBody, CardText} from 'reactstrap';
import ReCAPTCHA from "react-google-recaptcha";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import './Contact.css'


const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyA54dSQGPIJQ-oWwmIcg788iRlbE9BRfK4&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={18} defaultCenter={{ lat: 3.152743 , lng: 101.710467 }}>
    <Marker position={{ lat: 3.152743, lng: 101.710467 }} />
  </GoogleMap>
));

// 3.152743, 101.710467

export default class Contact extends Component {
  constructor(props){
    super(props);
    this.state = {email:'', comment:'', captchaPassed:false};
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log('handle submit');
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }
  validateForm = () => {
    return (this.state.email.length > 0 &&
      this.state.comment.length > 0 &&
      this.state.captchaPassed);
  }
  captcha = (e) => {
    //should change to check captcha state
    console.log('captcha changed state');
    this.setState({captchaPassed:!this.state.captchaPassed});
  }
  render(){
    return (<Container className="mt-2">
      <Row>
        <div className="col-12 col-md-8 text-left mb-3">
          <h4>Contact Us</h4>
          <hr />
          <p>Warning: not yet implemented</p>
          <Form onSubmit={this.handleSubmit} className="text-left">
            <FormGroup>
              <Label>Email:</Label>
              <Input id="email" type="email" placeholder="Email" value={this.state.email} onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label>Comment / Suggestion</Label>
              <Input type="textarea" rows="15" placeholder="Your comments and suggestion ..."
                id="comment" value={this.state.comment} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <ReCAPTCHA sitekey="6LeXCjwUAAAAAJS-BFBlmUAaC5KnB_ykR5uJ2g_M" onChange={this.captcha} />
            </FormGroup>
            <Button color="primary" type="submit" disabled={!this.validateForm()}>Send</Button>
          </Form>
        </div>
        <div className="col-12 col-md-8 mb-2">
          <MyMapComponent />
        </div>
        <div className="col-12 col-md-4 text-left">
          <Card>
            <CardBody>
              <address>
                <strong>Actuarial Partners Consulting Sdn. Bhd.,</strong><br />
                Suite 17.02, Kenanga International, <br />
                Jalan Sultan Ismail, <br />
                50250 Kuala Lumpur, Malaysia.
              </address>
              <CardText>
                Tel: <a href="tel:+60321610433">+60 3-2161 0433</a><br />
                Fax: +60 3-2161 3595 <br />
              </CardText>
              <CardText>Business Hours: Monday-Friday, 8.30am-5.00pm (GMT +8)</CardText>
            </CardBody>
          </Card>
        </div>
      </Row>
    </Container>)
  }
}
