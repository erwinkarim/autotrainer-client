import React, { Component } from 'react';
import { Nav, NavLink, NavItem, NavbarBrand, Navbar, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './MainNav.css';

/**
 * The Constructor
 * @param {json} props the props
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
      isOpen: false,
    };
  }
  signInUser = () => {
    if (this.props.auth != null) {
      this.props.auth.getSession();
    } else {
      console.log('auth is null');
    }
  }
  signOutUser = () => {
    if (this.props.auth != null) {
      this.props.auth.signOut();
    } else {
      console.log('auth is null');
    }
  }
  toggle = () => this.setState({ isOpen: !this.state.isOpen })
  toggleSession = () => this.setState({ sessionIsOpen: !this.state.sessionIsOpen })
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
          this.props.isAuthenticated ?
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

MainNav.propTypes = {
  auth: PropTypes.shape(),
  isAuthenticated: PropTypes.bool,
};

MainNav.defaultProps = {
  auth: null,
  isAuthenticated: false,
};
