import React, { Component } from "react";
import { Row, Nav, NavbarBrand, Navbar, NavbarToggler, Collapse, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Button } from "reactstrap";
import { NavItem } from 'reactstrap';
import { Link } from "react-router-dom";
import './MainNav.css'

class MainNav extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false
    }
  }
  signInUser = () => {
    if(this.props.auth != null){
      this.props.auth.getSession();
    } else {
      console.log('auth is null');
    }
  }
  signOutUser = () => {
    if(this.props.auth != null){
      this.props.auth.signOut();

    } else {
      console.log('auth is null');
    }
  }
  toggle = () => { this.setState({ isOpen: !this.state.isOpen }); }
  toggleSession = () => { this.setState({ sessionIsOpen: !this.state.sessionIsOpen }); }
  render(){
    return (
        <Navbar className="bg-light" light expand="lg">
          <NavbarBrand tag={Link} to="/">
            <img src="/logos/learn.part1.png" alt="learn@ap" height="30"/>
          </NavbarBrand>
          <NavbarBrand tag={Link} to="/">
            <img src="/logos/learn.part2.png" alt="learn@ap" height="30"/>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {
                this.props.isAuthenticated ? (
                  <UncontrolledDropdown className="nav-item" tag="li">
                    <DropdownToggle caret nav className="py-0" >
                      <img alt={this.props.currentUser.name} height="42" className="circle" src={this.props.currentUser.picture} />
                    </DropdownToggle>
                    <DropdownMenu right className="" style={ {'width':`${this.props.currentUser.email.length*0.9}em`, maxWidth:'100vw'}} >
                      <DropdownItem tag={Link} to="/welcome">
                        <Row className="mx-0">
                          <div className="col-3 pl-0">
                            <img height="45" alt={this.props.currentUser.name} className="circle" src={this.props.currentUser.picture} />
                          </div>
                          <div className="col-9">
                            <span>{this.props.currentUser.name}</span><br />
                            <span>{this.props.currentUser.email}</span>
                          </div>
                        </Row>
                      </DropdownItem>
                      <DropdownItem tag={Link} to="/courses">Courses</DropdownItem>
                      <DropdownItem divider />
                      <Button color="link" className="dropdown-item" onClick={this.signOutUser}>Logout</Button>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                ) : (
                  <NavItem>
                    <Button outline color="primary" onClick={this.signInUser}>Login</Button>
                  </NavItem>
                )
              }
            </Nav>
          </Collapse>
        </Navbar>
      );

  }
}

export default MainNav;
