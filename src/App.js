import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Routes from "./Routes";
import { Alert, Collapse, Navbar, NavbarToggler, Nav } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Container } from 'reactstrap';
//import RouteNavItem from './components/RouteNavItem';
import MainNav from './containers/MainNav';
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
      announceIsVisible: true,
      currentUser:null
    };
  }
  toggle() { this.setState({ isOpen: !this.state.isOpen }); }
  toggleCourse = () => { this.setState({ courseIsOpen: !this.state.courseIsOpen }); }
  toggleUser = () => { this.setState({ userIsOpen: !this.state.userIsOpen }); }
  toggleSystem = () => { this.setState({ systemIsOpen: !this.state.systemIsOpen }); }
  dismissAnnouncement = () => {this.setState({announceIsVisible:false})}
  componentDidMount = () => {
    //check for current user, if there is stored in storage, loaded and sign up

  }
  render() {
    return (
      <div className="App">
        <Alert color="primary" className="mb-0 text-left" isOpen={this.state.announceIsVisible} toggle={this.dismissAnnouncement}>
          Announcement Here !!!
        </Alert>
        <MainNav />
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
