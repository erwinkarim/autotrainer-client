import React, { Component } from "react";
import { Nav, Navbar, NavbarToggler, Collapse, UncontrolledDropdown, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Button } from "reactstrap";
import { NavItem, NavLink, FormGroup } from 'reactstrap';
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
        <Navbar className="bg-light" light expand="md">
          <Link to="/" className="navbar-brand">AutoTrainer</Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown className="nav-item" tag="li">
                <DropdownToggle caret nav>Mocks</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag={Link} to={'/login'}>Login</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem tag={Link} to={'/user/landing'}>Landing</DropdownItem>
                  <DropdownItem tag={Link} to={'/user/course_builder'}>Course Builder</DropdownItem>
                  <DropdownItem tag={Link} to={'/user/article_builder'}>Article Builder</DropdownItem>
                  <DropdownItem tag={Link} to={'/user/quiz_builder'}>Quiz Builder</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem tag={Link} to={'/courses/promo'}>Promo</DropdownItem>
                  <DropdownItem tag={Link} to={'/courses/toc'}>Toc</DropdownItem>
                  <DropdownItem tag={Link} to={'/courses/article'}>Article</DropdownItem>
                  <DropdownItem tag={Link} to={'/courses/quiz'}>Quiz</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              {
                this.props.isAuthenticated ? (
                  <UncontrolledDropdown className="nav-item" tag="li">
                    <DropdownToggle nav className="py-0" >
                      <img height="42" className="circle" src={this.props.currentUser.picture} />
                    </DropdownToggle>
                    <DropdownMenu right style={ {width:'300px'}}>
                      <DropdownItem tag={Link} to="/user/landing">
                        <FormGroup className="row mb-0">
                          <div className="col-3">
                            <img height="45" className="circle" src={this.props.currentUser.picture} />
                          </div>
                          <div className="col-9">
                            <span>{this.props.currentUser.name}</span><br />
                            <span>{this.props.currentUser.email}</span>
                          </div>
                        </FormGroup>
                      </DropdownItem>
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
