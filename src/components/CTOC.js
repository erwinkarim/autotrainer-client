/*
  component to show course TOC. not the be confused w/ a container that shows the course TOC page

  required props.course
*/
import React, { Component } from "react";
import { CardColumns, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import Notice from './Notice';
import config from '../config';
import { invokeApig } from "../libs/awsLibs";

export default class CTOC extends Component {
  constructor(props){
    super(props);

    this.state = {modules:[], options:null}

  }
  componentDidMount = async() => {
    var handle = this;

    //update the options
    var newOptions = Object.assign(this.props.defaultOptions, this.props.options);
    handle.setState({options:newOptions});

    //get the modules
    try{
      var results = await this.getModules();
      handle.setState({modules:results});
    } catch(e){
      console.log('error getting modules');
      console.log(e);
    }
  }
  getModules = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path: '/modules',
      queryParams: {courseId: this.props.course.courseId}
    });
  }
  render(){
    if(this.state.modules.length === 0){
      return (<Notice content="course modules is loading ..." />)
    }

    return (
      <CardColumns>{
        this.state.modules.map( (m,i) => {
          return (
            <Card key={i}>
              <CardBody>
                <CardTitle>
                  { this.state.options.showLink ? (
                    <Link to={`/courses/${m.moduleType}/${m.courseId}/${m.moduleId}`}>{i+1}: {m.title}</Link>
                  ) : (
                    <span>{i+1}: {m.title}</span>
                  )}
                </CardTitle>
                <CardText>{m.description}</CardText>
              </CardBody>
            </Card>
          );
        })
      }</CardColumns>
    )
  }
}

CTOC.defaultProps = {
  defaultOptions: { showLink:true }
}
