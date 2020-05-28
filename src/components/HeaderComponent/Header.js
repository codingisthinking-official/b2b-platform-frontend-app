import React, { Component } from "react";
import { Button, Form, FormControl } from "react-bootstrap";

import logo from "./logo.svg";
import './Header.css';

import AuthenticationService from "../../services/AuthenticationService";
import InstallPWAComponent from "../InstallPWAComponent/InstallPWAComponent";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faShoppingCart,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'

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
    let homeScreenButton = null;

    if (AuthenticationService.isAuthenticated()) {
      const user = AuthenticationService.getUser();

      if (user) {
        auth = (<div className={"container-header-top"}>
          <div className={"container"}>
            <p className="user">
              <span className="current--user">
                Zalogowany jako <strong>{user.name}</strong>
              </span>
              <Button href={"/cart/"} variant={"outline-info"} size={"md"}>
                <FontAwesomeIcon icon={ faShoppingCart } />
              </Button>
              <Button className={"btn-logout"}
                      onClick={this.logoutAction.bind(this)} variant={"outline-danger"}
                      size={"md"}>
                <FontAwesomeIcon icon={ faSignOutAlt } />
              </Button>
            </p>
          </div>
        </div>);

        search = (<Form className={"search-mobile"} inline onSubmit={e => {
          this.search();
          e.preventDefault();
          e.stopPropagation();
        }}>
          <FormControl type="text" placeholder="Szukaj produktu" className="mr-sm-2" onChange={e => {
            this.setState({"q": e.target.value});
          }}/>
          <Button variant="info" onClick={this.search.bind(this)}>
            <FontAwesomeIcon icon={ faSearch } /> szukaj
          </Button>
        </Form>);
      }
    } else {
      auth = (<div className={"container-header-top"}>
        <div className="container">
          <p className="user">
            <span className="current--user">
              Jeżeli nie masz konta na platformie, skontaktuj się z producentem - desk@codingisthinking.com
            </span>
          </p>
        </div>
      </div>);
    }

    homeScreenButton = (<InstallPWAComponent/>);

    return (
      <div className="container-header">
        {homeScreenButton}
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
