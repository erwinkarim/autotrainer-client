import React from "react";
import { Route } from "react-router-dom";
import { NavItem } from "reactstrap";

export default props =>
  <Route
    path={props.href}
    exact
    children={({ match, history }) =>
      <NavItem
        {...props}
        active={match ? true : false}
      >
        <NavLink tag={Link} to={props.href}> {props.children} </NavLink>
      </NavItem>}
  />;
  /*
      <NavItem
        onClick={e => history.push(e.currentTarget.getAttribute("href"))}
        {...props}
        active={match ? true : false}
      >
        {props.children}
      </NavItem>}
      */
