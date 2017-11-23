import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Routes from "./Routes";
import { Alert, Collapse, Navbar, NavbarToggler, Nav } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Container } from 'reactstrap';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      courseIsOpen: false,
      userIsOpen: false,
      systemIsOpen: false,
      announceIsVisible: true

    };
  }
  toggle() { this.setState({ isOpen: !this.state.isOpen }); }
  toggleCourse = () => { this.setState({ courseIsOpen: !this.state.courseIsOpen }); }
  toggleUser = () => { this.setState({ userIsOpen: !this.state.userIsOpen }); }
  toggleSystem = () => { this.setState({ systemIsOpen: !this.state.systemIsOpen }); }
  dismissAnnouncement = () => {this.setState({announceIsVisible:false})}
  render() {
    return (
      <div className="App">
        <Alert color="primary" className="mb-0 text-left" isOpen={this.state.announceIsVisible} toggle={this.dismissAnnouncement}>
          Announcement Here !!!
        </Alert>
        <Navbar className="bg-light" light expand="md">
          <Link to="/" className="navbar-brand">AutoTrainer</Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <Dropdown className={'nav-item'} tag={'li'} isOpen={this.state.systemIsOpen} toggle={this.toggleSystem}>
                <DropdownToggle caret nav>System</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={'a'} href={'/login'}>Login</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className={'nav-item'} tag={'li'} isOpen={this.state.userIsOpen} toggle={this.toggleUser}>
                <DropdownToggle caret nav>User</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={'a'} href={'/user/landing'}>Landing</DropdownItem>
                  <DropdownItem tag={'a'} href={'/user/course_builder'}>Course Builder</DropdownItem>
                  <DropdownItem tag={'a'} href={'/user/article_builder'}>Article Builder</DropdownItem>
                  <DropdownItem tag={'a'} href={'/user/quiz_builder'}>Quiz Builder</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className={'nav-item'} tag={'li'} isOpen={this.state.courseIsOpen} toggle={this.toggleCourse}>
                <DropdownToggle caret nav>Course</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={'a'} href={'/courses/promo'}>Promo</DropdownItem>
                  <DropdownItem tag={'a'} href={'/courses/toc'}>Toc</DropdownItem>
                  <DropdownItem tag={'a'} href={'/courses/article'}>Article</DropdownItem>
                  <DropdownItem tag={'a'} href={'/courses/quiz'}>Quiz</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Nav>
          </Collapse>
        </Navbar>
        <Routes />
        <footer className="footer text-muted">
          <Container>
            <p>
              &copy; AutoTrainer 2017 &bull; <Link to="/legal">Legal</Link> &bull; <Link to="/contact">Contact</Link>
            </p>
          </Container>
        </footer>
      </div>
    );
  }
}

export default App;
