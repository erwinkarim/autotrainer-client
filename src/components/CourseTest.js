import React, { Component } from "react";
import { Jumbotron, Container, Row, Col } from 'reactstrap';
import CourseMenu from '../components/CourseMenu';

export default class CourseTest extends Component {
  render(){
    return (
      <div>
        <Container><Row><Col><CourseMenu /></Col></Row></Container>
        <Jumbotron fluid className="mb-0">
          <Container>
            <h4 className="display-4">Chapter X: Article Title</h4>
            <p className="lead">Something to say about the article here</p>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <Col className="bg-info px-0" sm="12" lg="8">
              <div className="px-4 text-left">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
