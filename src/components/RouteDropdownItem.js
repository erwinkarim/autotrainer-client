import React from "react";
import { Route } from "react-router-dom";
import { DropdownItem } from "reactstrap";

export default props =>
  <Route
    path={props.href}
    exact
    children={({ match, history }) =>
      <DropdownItem
        onClick={e => history.push(e.currentTarget.getAttribute("href"))}
        {...props}
        active={match ? true : false}
      >
        {props.children}
      </DropdownItem>}
  />;

  /*
      <DropdownItem
        onClick={e => history.push(e.currentTarget.getAttribute("href"))}
        {...props}
        active={match ? true : false}
      >
        {props.children}
      </DropdownItem>}
      */
