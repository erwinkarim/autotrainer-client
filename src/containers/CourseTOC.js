import React, { Component } from "react";
import { Jumbotron, Container, Row, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import CTOC from '../components/CTOC';
import './CourseTOC.css';
import { Link } from 'react-router-dom';
import loremIpsum from 'lorem-ipsum';
import randomInt from 'random-int';
import { invokeApig } from "../libs/awsLibs";
import Helmet from 'react-helmet';

export default class CourseTOC extends Component {
  constructor(props){
    super(props);
    this.state = { course:null }
  }
  componentDidMount = async () => {
    /*
      additional checks:
      1. see if you are enrolled in the course
    */

    //load the course here
    var handle = this;
    try {
      var result = await this.getCourse();
      console.log('results', result);
      if(result != null){
        handle.setState({course:result});
      }
    } catch(e){
      console.log(e);
    };
  }
  getCourse = () => {
    return invokeApig({path:`/courses/${this.props.match.params.id}`})
  }
  render(){
    //render nothing is course is null
    if(this.state.course === null){
      return (<Container>
        <Row>
          <div className="col-12 col-md-8">
            <p>Course not found or loading ...</p>
          </div>
        </Row>
      </Container>);
    }
    return (
      <div>
        <Helmet>
          <title>{this.state.course.name}/TOC - AutoTrainer</title>
        </Helmet>
        <Container className="mt-2">
          <Row>
          </Row>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to="/user/landing">{this.props.currentUser.name}</Link></BreadcrumbItem>
            <BreadcrumbItem active>{this.state.course.name}</BreadcrumbItem>
          </Breadcrumb>
        </Container>
        <Jumbotron fluid>
          <Container>
            <h1 className="display-3">Welcome to {this.state.course.name}!!!</h1>
            <p className="lead">{this.state.course.tagline}</p>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <div className="col-12">
              <h3 className="display-4">Executive Summary</h3>
              { this.state.course.description.split('\n').map( (para,i) => {
                return (<p key={i} className="lead text-left">{para}</p>);
              })}
            </div>
            <div className="col-12">
              <h3 className="display-4">Table of Contents</h3>
              <CTOC {...this.state} {...this.props} />
            </div>
            <div className="col-12">
              <h2 className="display-4">Additional Resources</h2>
              <ul className="text-left">
                <li>Should show list of tables/images/etc</li>
              { Array.from(Array(randomInt(3,8)).keys()).map( (e,i) => {
                return (<li key={i}>{ loremIpsum()}</li>);
              })}
              </ul>
            </div>
          </Row>
        </Container>
      </div>
    )
  }
}
