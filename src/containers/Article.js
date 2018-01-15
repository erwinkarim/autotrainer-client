import React, { Component } from "react";
//import AWS from 'aws-sdk';
import { Container, Row, Jumbotron, Breadcrumb, BreadcrumbItem, Collapse } from 'reactstrap';
import { Card, CardHeader, CardBody, CardImg, CardText } from 'reactstrap';
import './Article.css';
import { Link } from 'react-router-dom';
import loremIpsum from 'lorem-ipsum';
import randomInt from 'random-int';
import { invokeApig } from '../libs/awsLibs';
import Interweave from 'interweave';
import Notice from '../components/Notice';
import Helmet from 'react-helmet';
import config from '../config';
import Waypoint from 'react-waypoint';

export default class Article extends Component {
  constructor(props){
    super(props);
    this.state = {article:null, enrolment:null, loading:true}
  }
  componentDidMount = async() => {
    var handle = this;

    try {
      var result = await this.loadArticle();
      handle.setState({article:result, loading:false});

    } catch(e){
      console.log('error fetching article');
      console.log(e);
    }

    //get enrolment status
    try {
      result = await this.getEnrolment();
      handle.setState({enrolment:result});
    } catch(e){
      console.log('error getting enrolment status');
      console.log('ignore if you own this course');
      console.log(e);
    }

  }
  loadArticle = () => {
    return invokeApig({
      endpoint:config.apiGateway.MODULE_URL,
      path:`/modules/${this.props.match.params.articleId}`,
      queryParams: {courseId:this.props.match.params.courseId}
    });


  }
  getEnrolment = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      path: `/enrolment/${this.state.article.courseId}`
    })
  }
  handleEnterViewport = async () => {
    var handle = this;
    console.log('should trigger class attended');
    /*
      1. check if progress has already been made
      2. send progress updates if necessary
    */
    if(this.state.enrolment !== null){
      //check if you already attend this article
      console.log('should check attendance');
      if( !handle.state.enrolment.progress.includes(handle.state.article.moduleId)){
        try {
          //check attendance
          console.log('notifyProgress');
          await this.notifyProgress();

          //update the erolment
          console.log('get updated enrollment status');
          var result = await this.getEnrolment();

          this.props.addNotification('We remark that you have read this article');
          handle.setState({enrolment:result});
        } catch (e){
          console.log('error getting attendance');
          console.log(e);
        }
      } //if()
    }
  }
  notifyProgress = () => {
    return invokeApig({
      endpoint: config.apiGateway.ENROLMENT_URL,
      method: 'POST',
      path: `/enrolment/${this.state.article.courseId}/attend/${this.state.article.moduleId}`,
      body: {}
    })
  }
  render(){
    if(this.state.loading){
      return <Notice content="Article is loading ..."/>;
    }

    if(this.props.currentUser === null){
      return (<Notice title="Unauthorized" content="You have not logged in yet ..."/>);
    }

    if(this.state.article === null){
      return (<Notice content="Loading article ..." />);
    }

    /*
      TODO: make sure the accordion works
    */
    var table_cols = randomInt(3,6);
    var article = this.state.article;
    return (
      <div className="text-left">
        <Helmet>
          <title>{ this.state.article.title } - AutoTrainer</title>
        </Helmet>
        <Container className="mt-2">
          <Breadcrumb>
            <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to="/welcome">{ this.props.currentUser.name}</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/courses/toc/${article.courseId}`}>{article.courseMeta.name}</Link></BreadcrumbItem>
            <BreadcrumbItem active>Module {article.order}: {article.title}</BreadcrumbItem>
          </Breadcrumb>
        </Container>
        <Jumbotron fluid>
          <Container>
            <h4 className="display-4">Chapter {article.order}: {article.title}</h4>
            <p className="lead">{article.description}</p>
          </Container>
        </Jumbotron>
        <Container>
          { /* actual */}
          <Row>
            <div className="col-12 col-md-8 text-justify">
              <Interweave tagName="div" content={article.body} disableLineBreaks={true} />
            </div>
          </Row>
          { /* demonstration */}
          <hr />
          <Row>
            <div className="col-12">
              <p className="lead">
                A demonstration of what each of the subject chapter should be taking about.
                The chapter will split into section, each has their drop down menu thing
              </p>
            </div>
            <div className="col-12 col-md-8">
              <h3 className="display-5">Normal paragraph with quotes</h3>
              <p className="lead"> Show paragraph with block quotes. {loremIpsum()} </p>
              { Array.from(Array(randomInt(5,8)).keys()).map( (e,i) => {
                var result = 1 === randomInt(10) ? (
                  <Card className="mb-2" key={i}>
                    <CardBody>
                      <blockquote className="blockquote">
                        <p>{loremIpsum()}</p>
                        <footer className="blockquote-footer">
                          Someone Famous <cite>Source</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                ) : (
                  <p key={i}>{loremIpsum({count:5, unit:'paragraphs', sentanceLowerBound:5, sentanceUpperBound:15, paragraphLowerBound:10, paragraphUpperBound:15})}</p>
                );
                return result;
              })}
              <h3 className="display-5">Something with pictures</h3>
              <p className="lead">Show a picture to highlight stuff</p>
              <Card className="mb-2">
                <CardImg top width="100%" src="http://www.screengeek.net/wp-content/uploads/2017/05/thor-ragnarok-marvel.png" />
                <CardBody>
                  <CardText>Talk about the image</CardText>
                </CardBody>
              </Card>
              { Array.from( Array( randomInt(2,3)).keys()).map( (e,i) => {
                return (<p key={i}>{loremIpsum({count:randomInt(3,5), unit:'paragraphs'})}</p>)
              })}
              <h3 className="display-5">Maybe a video too</h3>
              <p className="lead">Show a video to highlight stuff</p>
              <Card>
                <CardImg top tag="div" className="embed-responsive embed-responsive-16-by-9" style={ {height:'300px'}}>
                  <CardImg top tag="iframe" width="1600" src="https://www.youtube.com/embed/WxfZkMm3wcg?rel=0" />
                </CardImg>
                <CardBody>
                  <CardText>Talk about the video above</CardText>
                  <CardText>{loremIpsum()}</CardText>
                </CardBody>
              </Card>
              { Array.from( Array( randomInt(2,3)).keys()).map( (e,i) => {
                return (<p key={i}>{loremIpsum({count:3, unit:'paragraphs'})}</p>)
              })}
              <h3 className="display-5">Instructional accordion to explain things</h3>
              <p className="lead">Show a step-by-step instructions in accordion form</p>
              <div className="mb-2" id="accordion-parent">{ Array.from(Array( randomInt(4,7)).keys()).map( (e,i) => {
                return (<Card key={i}>
                  <CardHeader>
                    <h5 className="mb-0">
                      <a href={`#step-${i}`} data-toggle="collapse">{`Step ${i+1}: ${loremIpsum()}`}</a>
                    </h5>
                    <Collapse id={`step-${i}`} data-parent='#accordion-parent' isOpen={i===0 ? true : false}>
                      <CardBody>
                        <CardText>{loremIpsum({count:randomInt(3,5), unit:'paragraphs'})}</CardText>
                      </CardBody>
                    </Collapse>
                  </CardHeader>
                </Card>);
              })}</div>
              { Array.from( Array( randomInt(2,3)).keys()).map( (e,i) => {
                return (<p key={i}>{loremIpsum({count:3, unit:'paragraphs'})}</p>)
              })}
              <h3 className="display-5">A table to really tell things up</h3>
              <p className="lead">Show a table. {loremIpsum()}.</p>
              <table className="table table-stripped table-responsive">
                <thead>{ Array.from( Array(table_cols).keys() ).map( (e,i) => {
                  return (<th key={i}>{`Col ${i+1}`}</th>)
                })}</thead>
                <tbody>{ Array.from( Array( randomInt(4,8) ).keys() ).map( (e,i) => {
                  return (<tr key={i}>{ Array.from( Array(table_cols).keys() ).map( (e2,i2) => {
                    return (<td key={i2}>something</td>);
                  })}</tr>)
                })}</tbody>
              </table>
              { Array.from( Array( randomInt(2,3)).keys()).map( (e,i) => {
                return (<p key={i}>{loremIpsum({count:3, unit:'paragraphs'})}</p>)
              })}
            </div>
          </Row>
        </Container>

        <Waypoint onEnter={this.handleEnterViewport} />
      </div>
    )
  }
}
