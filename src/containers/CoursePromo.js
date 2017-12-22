import './CoursePromo.css';
import React, { Component } from "react";
import {Container, Jumbotron, Row} from 'reactstrap';
import { Link } from 'react-router-dom';
import {CardDeck, Card, CardBody, CardTitle, CardText,  Button, Badge} from 'reactstrap';
import loremIpsum from 'lorem-ipsum';
import { invokeApig } from "../libs/awsLibs";
import config from '../config';
import CTOC from '../components/CTOC';
import Helmet from 'react-helmet';

/* button to enrol or show TOC */
class EnrolButton extends Component {
  render(){
    const { handleEnrolCourse, enrolText, enrolledText, ...rest} = this.props;

    //check enrolment status
    return this.props.enrolment === null ?
        ( <Button {...rest} type="button" color="primary" onClick={handleEnrolCourse} data-course={this.props.course.courseId}>{enrolText}</Button> ) :
        ( <Button {...rest} tag={Link} to={`/courses/toc/${this.props.course.courseId}`}>{enrolledText}</Button>)
        ;

  }
}

EnrolButton.defaultProps = {
  enrolText:'Enrol',
  enrolledText: 'Table of Contents'
}

export default class CoursePromo extends Component {
  constructor(props){
    super(props);
    this.state = {
      course:null, enrolment:null
    }
  }
  componentDidMount = async() => {
    //load the course and enrolment status
    var handle = this;
    try {
      var result = await this.getCourse();
      if(result != null){
        handle.setState({course:result });
      }
    } catch(e){
      //throw new Error(e);
      console.log(e);
    };

    try{
      var enrolmentStatus = await this.getEnrolmentStatus();
      this.setState({enrolment:this.enrolmentStatus});
    } catch(e){
      console.log(e);
      if(e.error === "Item not found"){
        console.log('item not found');
      }
    }
  }
  getCourse = () => {
    return invokeApig({path:`/courses/${this.props.match.params.id}`})
  }
  getEnrolmentStatus = () => {
    return invokeApig({
      endpoint:config.apiGateway.ENROLMENT_URL,
      path:`/enrolment/${this.props.match.params.id}`
    });
  }
  handleEnrolCourse = async(e) => {
    console.log('should enrol for course');
    try {
      var result = await this.enrolCourse(e.target.dataset.course);
      this.setState({enrolment: result});
      this.props.addNotification('Course enrolled');
    } catch(e){
      console.log('problems trying to enrol course');
      console.log(e);
    }
  }
  enrolCourse = (courseId) => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      method: 'POST',
      path: '/enrolment',
      body: { courseId: courseId}
    });
  }
  render(){
    //check if course is loaded
    if(this.state.course === null){
      return (<div>Course not yet loaded ...</div>)
    }
    return (
      <div>
        <Helmet>
          <title>{this.state.course.name} - AutoTrainer</title>
        </Helmet>
        <Jumbotron fluid>
          <Container>
            <h1 className="display-3 text-center">{this.state.course.name}</h1>
            { this.state.course.tagline !== undefined ? (<p className="lead">{this.state.course.tagline}</p>) : null}
            <p><EnrolButton outline {...this.state} { ...{enrolText:`Enrol for RM${this.state.course.price}`, handleEnrolCourse:this.handleEnrolCourse} } /></p>
          </Container>
        </Jumbotron>
        <Container>
          {
            (this.state.course.key_points === undefined || this.state.course.key_points === null) ? null : (
              <Row>
                <div className="col-12 mb-2">
                  <CardDeck>{
                    this.state.course.key_points.map( (e,i) => {
                      return (
                        <Card key={i}>
                          <CardBody>
                            <CardTitle className="text-center">{e.title}</CardTitle>
                            <CardText>{e.subtext}</CardText>
                          </CardBody>
                        </Card>
                      )
                    })
                  }</CardDeck>
                </div>
              </Row>
            )
          }
          <Row>
            <div className="col-12 mb-2">
              <h2 className="display-4 text-center">Recent Customers</h2>
              <p>Have to figure out how to do this</p>
            </div>
           { ['256x256 BKR-rd.png','256x256 IIT-rd.png', '256x256 KN-rd.png', '256x256 TI-rd.png',
              '256x256 TMIG-rd.png', '256x256 WBG-rd.png' ].map( (e,i) => {
               return (
                <div className="col-3 col-md-2 mb-2" key={i}>
                 <img alt={e} className="img-fluid img-grayscale" src={`${process.env.PUBLIC_URL}/logos/${e}`} />
                </div>
               );
             })}
          </Row>
        </Container>
        <Container>
          <Row>
            <div className="col-12">
              <h4 className="display-4">Table of Contents</h4>
            </div>
            <CTOC course={this.state.course} options={ {showLink:false} }/>
          </Row>
          <Row>
            <div className="col-12">
              <h3 className="display-4">Final Thoughts</h3>
              { this.state.course.description.split('\n').map( (e,i) => {
                return (<p className="lead text-left" key={i}>{e}</p>)
              })}
              <EnrolButton {...this.state} handleEnrolCourse={this.handleEnrolCourse} />
              <p>
              { [1,2,3].map( (e,i) => {
                return (<Badge key={i} href="#" color="secondary" className="mr-2">{loremIpsum({count:2, units:'words'})}</Badge>)
              })}
              </p>
            </div>
          </Row>
        </Container>
        <Jumbotron fluid>
          <Container>
            <h1 className="display-3">Pricing</h1>
            <p className="lead">Just RM{this.state.course.price}</p>
            <div className="d-flex">
            <EnrolButton {...this.state} handleEnrolCourse={this.handleEnrolCourse} className="mx-auto"/>
            </div>
          </Container>
        </Jumbotron>
      </div>
    )

  }
}
