import React, { Component } from "react";
import { Container, Row } from 'reactstrap'
import {Breadcrumb, BreadcrumbItem, FormGroup, Input, Button} from 'reactstrap';
import { Link } from 'react-router-dom';
import './ArticleBuilder.css';


export default class ArticleBuilder extends Component {
  render(){
    return (
      <Container className="mt-2 text-left">
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/user/landing">FirstName LastName</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/user/course_builder">Course Builder</Link></BreadcrumbItem>
              <BreadcrumbItem active>Article Builder</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="col-12 col-md-8">
            <h3>Article Builder</h3>
            <p>Put react draft here</p>
            <FormGroup>
              <Input type="textarea" rows="30" />
            </FormGroup>
            <FormGroup>
              <Button color="primary" className="mr-2">Update</Button>
              <Button color="danger">Cancel</Button>
            </FormGroup>
          </div>
        </Row>
      </Container>
    )
  }
}
