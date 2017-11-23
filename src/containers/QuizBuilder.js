import React, { Component } from "react";
import { Container, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Card, CardHeader, CardBody, CardText, CardFooter} from 'reactstrap';
import { FormGroup, Input, Label, Button } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {Link} from 'react-router-dom';
import loremIpsum from 'lorem-ipsum';
import randomInt from 'random-int';
import './QuizBuilder.css';


export default class QuizBuilder extends Component {
  constructor(props){
    super(props);
    this.state = {
      newQuestionMenu:false
    };
  }
  toggleNewQuestion = (e)=>{e.preventDefault(); this.setState({newQuestionMenu:!this.state.newQuestionMenu}); }
  render(){

    return (
      <Container className="text-left">
        <Row>
          <div className="col-12">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/user/landing">FirstName LastName</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/user/course_builder">Course Builder</Link></BreadcrumbItem>
              <BreadcrumbItem active>Quiz Builder</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="col-12 col-md-8">
            <h2>Quiz Editor</h2>
            { Array.from( Array(3).keys()).map( (e,i) => {
              return (<Card className="mb-2" key={i}>
                <CardHeader>Question {i+1}</CardHeader>
                <CardBody>
                  <CardText>{loremIpsum()}?</CardText>
                  { Array.from( Array( randomInt(3,5)).keys() ).map( (e2,i2) => {
                    return (
                      <FormGroup check key={i2}>
                        <Label check>
                          <Input type="radio" name={`choice-${i}`} />
                          { loremIpsum() }
                          { i === 1 ? (<span className="text-success"> - correct answer</span>) : null }
                        </Label>
                      </FormGroup>
                    )
                  })}
                </CardBody>
                <CardFooter>
                  <Button color="primary">Update</Button>
                  <Button color="danger">Delete</Button>
                </CardFooter>
              </Card>);
            })}
            <Card className="mb-2">
              <CardHeader>Edit Question</CardHeader>
              <CardBody>
                <CardText>Question:</CardText>
                <FormGroup>
                  <Input type="text" defaultValue={loremIpsum()} />
                </FormGroup>
                <Row>
                  <div className="col-9">Potential answer:</div>
                  <div className="col-2">Correct answer</div>
                </Row>
                { Array.from( Array( randomInt(2,5)).keys() ).map( (e,i) => {
                  return (<Row className="mb-1" key={i}>
                    <div className="col-9">
                      <Input type="text" defaultValue={loremIpsum()} />
                    </div>
                    <div className="col-2 text-center">
                      <Input type="radio" name={`choice-${i}`} defaultValue={loremIpsum()} />
                    </div>
                    <div className="col-1 px-0">
                      <Button color="danger" size="sm">X</Button>
                    </div>
                  </Row>);

                })}
                <Row className="mb-1">
                  <div className="col-12"> <Button color="info">Add</Button> </div>
                </Row>
              </CardBody>
            </Card>
          </div>
          <div className="col-12 col-md-8">
            <Dropdown isOpen={this.state.newQuestionMenu} toggle={this.toggleNewQuestion}>
              <DropdownToggle caret>New Question</DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Multiple Choice</DropdownItem>
                <DropdownItem>Fill-in-blanks</DropdownItem>
                <DropdownItem>Multiple Check</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Row>
      </Container>
    )
  }
}
