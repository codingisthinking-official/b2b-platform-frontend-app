import React, { Component } from "react";
import { Button, Form, FormControl, Row, Col } from "react-bootstrap";

import logo from "./logo.svg";
import './Header.css';

import AuthenticationService from "../../services/AuthenticationService";

class Header extends Component {
  logoutAction() {
    AuthenticationService.logout();
    window.location.href = '/';
  }

  search() {
    if (this.state.q.length > 0) {
      window.location.href = '/products/search/' + encodeURIComponent(this.state.q) + '/';
    }
  }

  render() {
    let auth = null;
    let search = null;

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

        search = (<Form className={"search-mobile"} inline onSubmit={e => {
          this.search();
          e.preventDefault();
          e.stopPropagation();
        }}>
          <FormControl type="text" placeholder="Search for a product" className="mr-sm-2" onChange={e => {
            this.setState({"q": e.target.value});
          }}/>
          <Button variant="info" onClick={this.search.bind(this)}>Search</Button>
        </Form>);
      }
    }

    return (
      <div className="container-header">
        {auth}
        <header className={"container"} style={{'textAlign': (this.props.center ? 'center' : '')}}>
          <a href={"/"} title="Homepage">
            <img src={logo} alt={"B2B CodingIsThinking"} />
          </a>
          {search}
        </header>
      </div>
    );
  }
}

export default Header
