import React, { Component } from "react";
import { Jumbotron, Container, Row, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import CTOC from '../components/CTOC';
import './CourseTOC.css';
import { Link } from 'react-router-dom';
import { invokeApig } from "../libs/awsLibs";
import config from '../config';
import Helmet from 'react-helmet';
import Notice from '../components/Notice'

export default class CourseTOC extends Component {
  constructor(props){
    super(props);
    this.state = { course:null, enrolment:null, loading:true }
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
        handle.setState({course:result, loading: false});
      }
    } catch(e){
      console.log(e);
    };

    try {
      result = await this.getEnrolment();
      this.setState({enrolment:result});
    } catch(e){
      console.log('enrolment not found');
      console.log('ignore this if you own this course');
      console.log(e);
    }
  }
  getCourse = () => {
    return invokeApig({path:`/courses/${this.props.match.params.id}`})
  }
  getEnrolment = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path: `/enrolment/${this.props.match.params.id}`
    });

  }
  render(){
    //loading screen
    if(this.state.loading){
      return <Notice content="Course is loading ..." />
    };

    //course not found
    if(this.state.course === null){
      return <Notice content="Course not found ..." />
    }

    var bg_styling = this.state.course.bg_pic ?
      {backgroundImage:`url(${this.state.course.bg_pic})`, backgroundRepeat:'no-repeat', backgroundSize:'cover'} : 
      null;
    return (
      <div>
        <Helmet>
          <title>{this.state.course.name}/TOC - AutoTrainer</title>
        </Helmet>
        <Container className="mt-2">
          <Breadcrumb>
            <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to="/welcome">{this.props.currentUser.name}</Link></BreadcrumbItem>
            <BreadcrumbItem active>{this.state.course.name}</BreadcrumbItem>
          </Breadcrumb>
        </Container>
        <Jumbotron fluid style={ bg_styling }>
          <Container>
            <h1 className="display-3">Welcome to {this.state.course.name}</h1>
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
              <CTOC {...this.state} {...this.props} showLink={true} enrolment={this.state.enrolment}/>
            </div>
            { /*
              <div className="col-12">
                <h2 className="display-4">Additional Resources</h2>
                <ul className="text-left">
                  <li>Should show list of tables/images/etc</li>
                { Array.from(Array(randomInt(3,8)).keys()).map( (e,i) => {
                  return (<li key={i}>{ loremIpsum()}</li>);
                })}
                </ul>
              </div>
            */ }
          </Row>
        </Container>
      </div>
    )
  }
}
