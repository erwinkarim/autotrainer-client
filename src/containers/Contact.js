import React, { Component } from 'react';
import {Container, Row, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import ReCAPTCHA from "react-google-recaptcha";
import './Contact.css'

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
        <div className="col-12 col-md-8 text-left">
          <p>Warning: not yet implemented</p>
          <Form onSubmit={this.handleSubmit} className="text-left">
            <FormGroup>
              <Label>Email:</Label>
              <Input id="email" type="email" placeholder="Email" value={this.state.email} onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label>Comment / Suggestion</Label>
              <Input type="textarea" rows="20" placeholder="Your comments and suggestion ..."
                id="comment" value={this.state.comment} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <ReCAPTCHA sitekey="6LeXCjwUAAAAAJS-BFBlmUAaC5KnB_ykR5uJ2g_M" onChange={this.captcha} />
            </FormGroup>
            <Button color="primary" type="submit" disabled={!this.validateForm()}>Send</Button>
          </Form>
        </div>
      </Row>
    </Container>)
  }
}
