import React, { Component } from "react";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Link } from 'react-router-dom';
import Notice from '../components/Notice';
import Helmet from 'react-helmet';

export default class Video extends Component {
  render(){
    if(this.props.currentUser === null){
      return (<Notice content="user Unauthorized" />);
    };

    return (
      <Container className="mt-3">
        <Helmet>
          <title>Video: Video Title - AutoTrainer</title>
        </Helmet>
        <Row>
          <Col sm="12">
            <Breadcrumb>
              <BreadcrumbItem tag={Link} to="/">Home</BreadcrumbItem>
              <BreadcrumbItem tag={Link} to="/user/landing">{this.props.currentUser.name}</BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <Col>
            <p>Display video here</p>
          </Col>
        </Row>
      </Container>
    );
  }
}
