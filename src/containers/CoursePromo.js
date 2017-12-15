import './CoursePromo.css';
import React, { Component } from "react";
import {Container, Jumbotron, Row} from 'reactstrap';
import {CardDeck, Card, CardBody, CardTitle, CardText,  Button, Badge} from 'reactstrap';
import loremIpsum from 'lorem-ipsum';
import { invokeApig } from "../libs/awsLibs";
import CTOC from '../components/CTOC';
import Helmet from 'react-helmet';

export default class CoursePromo extends Component {
  constructor(props){
    super(props);
    this.state = {
      course:null
    }
  }
  componentDidMount = async() => {
    //load the course
    var handle = this;
    try {
      var result = await this.getCourse();
      console.log('results', result);
      if(result != null){
        handle.setState({course:result});
      }
    } catch(e){
      //throw new Error(e);
      console.log(e);
    };
  }
  getCourse = () => {
    return invokeApig({path:`/courses/${this.props.match.params.id}`})
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
            <p>
              <Button type="button" outline color="primary">Enroll</Button> for RM{this.state.course.price}
            </p>
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
              <Button color="primary">Get Started!!!</Button>
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
              <Button color="primary" className="mx-auto">Get Started!</Button>
            </div>
          </Container>
        </Jumbotron>
      </div>
    )

  }
}
