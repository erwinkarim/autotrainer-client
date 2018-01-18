import React, { Component } from "react";
import { Container, Row, Col, Button, Card, CardText } from 'reactstrap';
import config from '../config';
import { invokeApig } from "../libs/awsLibs";
import Notice from '../components/Notice';

/*
  a container to invoke module test gateway
*/
export default class TestFn extends Component{
  constructor(props){
    super(props);
    this.state = { loading:false };
  }
  handleClick = async () => {
    try{
      this.setState({loading:true});
      await this.invokeTest();
      console.log('invoke successful');
      this.setState({loading:false});
    } catch(e){
      console.log('error invoking test');
      console.log(e);
      this.setState({loading:false});
    }
  }
  invokeTest = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path: '/modules/test'
    });
  }
  render(){
    //applicable to admins only;
    if(this.props.currentUser === null){
      return <Notice content="user not logged in" />;
    }

    if(!this.props.currentUser['cognito:groups'].includes('admin')){
      return <Notice content="for admins only" />;
    }

    return (
      <Container className="mt-2">
        <Row>
          <Col>
            <Card body>
              <CardText><Button color="primary" disabled={this.state.loading} onClick={this.handleClick}>Invoke Test</Button></CardText>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
};
