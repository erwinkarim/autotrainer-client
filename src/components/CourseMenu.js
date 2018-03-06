/*
  Course side bar showing, overview, course contents, etc
*/

import React, { Component } from "react";
import { Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, Collapse } from 'reactstrap';
import FontAwesome from 'react-fontawesome'
import './CourseMenu.css';
import { invokeApig } from '../libs/awsLibs';
import { Link } from 'react-router-dom';
import config from '../config';

export default class CourseMenu extends Component {
  constructor(props){
    super(props);
    this.state = { collapse:true, courseInfo:null, modules:[], loaded:false }
  }
  toggleNavbar = (e) => { this.setState({collapse:!this.state.collapse}); }
  componentDidMount = async () => {
    //load the course info
    try {
      var result = await this.getCourseInfo();
      this.setState({courseInfo:result});
    } catch(e){
      console.log('error getting course info');
      console.log(e);
    }

    //load the course modules based on courseId
    try{
      var results = await this.getCourseModules();
      this.setState({modules:results, loaded:true});
    } catch(e){
      console.log('error getting modules');
      console.log(e);
    }
  }
  getCourseInfo = () => {
    return invokeApig({
      path:`/courses/${this.props.courseId}`
    })
  }
  getCourseModules = () => {
    return invokeApig({
      endpoint: config.apiGateway.MODULE_URL,
      path:`/modules`,
      queryParams: { courseId: this.props.courseId }
    });
  }
  render(){
    if(!this.state.loaded){
      return (<Navbar><NavbarBrand> Loading ... </NavbarBrand></Navbar>);
    };

    return (
      <Navbar className="px-0">
        <NavbarToggler onClick={this.toggleNavbar} className="">
          <FontAwesome name="bars" />
        </NavbarToggler>
        <NavbarBrand className="mr-auto brand-text">{ this.state.courseInfo.name }</NavbarBrand>
        <Collapse navbar isOpen={!this.state.collapse} className="">
          <Nav navbar className="text-left">
            <NavItem><NavLink tag={Link} to={`/courses/toc/${this.props.courseId}`}><h4>Course Overview</h4></NavLink></NavItem>
            { this.state.modules.map( (m,i) => {
              return (<NavItem key={i}>
                <NavLink tag={Link} to={`/courses/${m.moduleType}/${this.props.courseId}/${m.moduleId}`}>{ m.moduleId === this.props.moduleId ? <i>{m.title}</i> : m.title }</NavLink>
              </NavItem>)
            })}
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

CourseMenu.defaultProps = {
  courseId:'4c082890-e510-11e7-bd48-59001745cb8e',
  moduleId: '0e1e3b80-ff48-11e7-b64f-c32e5e53678a'
}
