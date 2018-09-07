import React, { Component } from 'react';
import { Nav, NavLink, NavItem, NavbarBrand, Navbar, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Auth, Hub } from 'aws-amplify';

import './MainNav.css';

/**
 * The Constructor
 * @param {object} capsule listener
 * @param {object} props the props
 * @returns {null} The sum of the two numbers.
 */
export default class MainNav extends Component {
  /**
   * The Constructor
   * @param {json} props the props
   * @returns {null} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };

    // setup listener
    Hub.listen('auth', this, 'MyListener');
  }
  componentDidMount = () => {
    // check authentication
    Auth.currentAuthenticatedUser()
      .then(() => {
        this.setState({ isAuthenticated: true });
      })
      .catch(() => {
        this.setState({ isAuthenticated: false });
      });
  }
  onHubCapsule = (capsule) => {
    const { channel, payload } = capsule;
    if (channel === 'auth') {
      switch (payload.event) {
        case 'signIn':
          // update the user creds
          this.setState({ isAuthenticated: true });
          break;
        case 'signOut':
          // delete the user creds
          this.setState({ isAuthenticated: false });
          break;
        default:
          console.log('unhandled event');
      }
      console.log('payload', payload);
    }
  }
  signInUser = () => {
    window.location = '/welcome';
  }
  signOutUser = () => {
    Auth.signOut();
    window.location = '/';
  }
  render = () => (
    <Navbar className="bg-light flex-column flex-md-row" light expand tag="header">
      <NavbarBrand className="mr-0 mr-md-2" tag={Link} to="/">
        <img src="/logos/learn.part1.png" alt="learn@ap" height="30" />
      </NavbarBrand>
      <NavbarBrand className="d-none d-md-block" tag={Link} to="/">
        <img src="/logos/learn.part2.png" alt="learn@ap" height="30" />
      </NavbarBrand>
      <div className="navbar-nav-scroll ml-md-auto">
        {
          this.state.isAuthenticated ?
            <Nav className="flex-scroll" navbar>
              <NavItem><NavLink tag={Link} to="/">Home</NavLink></NavItem>
              <NavItem><NavLink tag={Link} to="/courses" className="courses-nav">Courses</NavLink></NavItem>
              <NavItem><NavLink tag={Link} to="/welcome" className="user-landing">You</NavLink></NavItem>
              <NavItem className="pl-4"><Button outline color="danger" onClick={this.signOutUser}>Logout</Button> </NavItem>
            </Nav>
          :
            <Nav className="flex-scroll" navbar>
              <NavItem><NavLink tag={Link} to="/courses">Explore Courses</NavLink></NavItem>
              <NavItem><Button outline color="primary" onClick={this.signInUser}>Login</Button></NavItem>
            </Nav>
        }
      </div>
    </Navbar>
  )
}
