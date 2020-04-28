import React, { Component } from "react";
import { Button } from "react-bootstrap";

import logo from "./logo.svg";
import './Header.css';

import AuthenticationService from "../../services/AuthenticationService";

class Header extends Component {
  logoutAction() {
    AuthenticationService.logout();
    window.location.href = '/';
  }

  render() {
    let auth = null;

    if (AuthenticationService.isAuthenticated()) {
      const user = AuthenticationService.getUser();

      if (user) {
        auth = (<div className={"container"}>
          <p className="user">
            Logged as <strong>{user.name} ({user.email})</strong>
            <Button className={"btn-logout"}
                    onClick={this.logoutAction.bind(this)} variant={"secondary"}
                    size={"sm"}>Logout</Button>
          </p>
        </div>);
      }
    }

    return (
      <div className="container-header">
        <header className={"container"} style={{'textAlign': (this.props.center ? 'center' : '')}}>
          <a href={"/"} title="Homepage">
            <img src={logo} alt={"B2B CodingIsThinking"} />
          </a>
        </header>
        {auth}
      </div>
    );
  }
}

export default Header
