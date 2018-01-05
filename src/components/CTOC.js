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
      <div>
        {
          this.props.enrolment === null ? null :
          this.props.enrolment.progress.length === this.state.modules.length ? (
            <Card body className="border border-success mb-2">
              <CardTitle className="mb-2">All modules attended</CardTitle>
            </Card>
          ) : null
        }
        <CardColumns>{
          this.state.modules.map( (m,i) => {
            var attended = this.props.enrolment === null ? false :
              this.props.enrolment.progress.includes(m.moduleId)
            return (
              <Card key={i} className={`${attended ? 'border border-success' : null}`}>
                <CardBody>
                  <CardTitle>
                    { this.state.options.showLink ? (
                      <Link to={`/courses/${m.moduleType}/${m.courseId}/${m.moduleId}`}>{i+1}: {m.title}</Link>
                    ) : (
                      <span>{i+1}: {m.title}</span>
                    )}
                  </CardTitle>
                  <CardText>{m.description}</CardText>
                  { attended ? <CardText className="text-success">Module attended</CardText> : null }
                </CardBody>
              </Card>
            );
          })
        }</CardColumns>
      </div>
    )
  }
}

CTOC.defaultProps = {
  defaultOptions: { showLink:true, enrolment:null }
}
