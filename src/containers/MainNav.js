import React, { Component } from "react";
import { Nav, Navbar, NavbarToggler, Collapse,  Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { NavItem, NavLink } from 'reactstrap';
import { Link } from "react-router-dom";

class MainNav extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      courseIsOpen: false,
      userIsOpen: false,
      systemIsOpen: false
    }
  }
  toggle = () => { this.setState({ isOpen: !this.state.isOpen }); }
  toggleCourse = () => { this.setState({ courseIsOpen: !this.state.courseIsOpen }); }
  toggleUser = () => { this.setState({ userIsOpen: !this.state.userIsOpen }); }
  toggleSystem = () => { this.setState({ systemIsOpen: !this.state.systemIsOpen }); }
  render(){
    return (
        <Navbar className="bg-light" light expand="md">
          <Link to="/" className="navbar-brand">AutoTrainer</Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <Dropdown className={'nav-item'} tag={'li'} isOpen={this.state.systemIsOpen} toggle={this.toggleSystem}>
                <DropdownToggle caret nav>System</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={Link} to={'/login'}>Login</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className={'nav-item'} tag={'li'} isOpen={this.state.userIsOpen} toggle={this.toggleUser}>
                <DropdownToggle caret nav>User</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={Link} to={'/user/landing'}>Landing</DropdownItem>
                  <DropdownItem tag={Link} to={'/user/course_builder'}>Course Builder</DropdownItem>
                  <DropdownItem tag={Link} to={'/user/article_builder'}>Article Builder</DropdownItem>
                  <DropdownItem tag={Link} to={'/user/quiz_builder'}>Quiz Builder</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className={'nav-item'} tag={'li'} isOpen={this.state.courseIsOpen} toggle={this.toggleCourse}>
                <DropdownToggle caret nav>Course</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={Link} to={'/courses/promo'}>Promo</DropdownItem>
                  <DropdownItem tag={Link} to={'/courses/toc'}>Toc</DropdownItem>
                  <DropdownItem tag={Link} to={'/courses/article'}>Article</DropdownItem>
                  <DropdownItem tag={Link} to={'/courses/quiz'}>Quiz</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <NavItem>
                <NavLink tag={Link} to="/">Login</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      );

  }
}

export default MainNav;
