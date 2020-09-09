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
import CartService from "../../services/CartService";

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
    let homepageLink = "/";

    if (AuthenticationService.isAuthenticated()) {
      const user = AuthenticationService.getUser();

      if (user) {
        let shoppingCart = null;
        if (!AuthenticationService.isSupplier()) {
          let numberOfItemsComponent = null;
          const cartItems = CartService.getCart();

          if (cartItems && cartItems.length > 0) {
            cartItems.map((c) => {
              numberOfItemsComponent += c.quantity;
            });


            numberOfItemsComponent = (
              <div className={"number"}>{numberOfItemsComponent}</div>);
          }
          shoppingCart = (
            <Button href={"/cart/"} className={"cart--basket-btn"}
                    variant={"outline-info"} size={"md"}>
              <FontAwesomeIcon icon={faShoppingCart}/>
              {numberOfItemsComponent}
            </Button>);
        }
        auth = (<div className={"container-header-top"}>
          <div className={"container"}>
            <p className="user">
              <span className="current--user">
                Welcome, <strong>{user.name}</strong>
              </span>
              {shoppingCart}
              <Button className={"btn-logout"}
                      onClick={this.logoutAction.bind(this)} variant={"outline-danger"}
                      size={"md"}>
                <FontAwesomeIcon icon={ faSignOutAlt } />
              </Button>
            </p>
          </div>
        </div>);

        if (!AuthenticationService.isSupplier()) {
          search = (<Form className={"search-mobile"} inline onSubmit={e => {
            this.search();
            e.preventDefault();
            e.stopPropagation();
          }}>
            <FormControl type="text" placeholder=""
              className="mr-sm-4" onChange={e => {
                this.setState({"q": e.target.value});
            }}/>
            <Button variant="primary" onClick={this.search.bind(this)}>
              <FontAwesomeIcon icon={faSearch}/> search
            </Button>
          </Form>);
        } else {
          homepageLink = "/manage/products/";
        }
      }
    } else {
      auth = (<div className={"container-header-top"}>
        <div className="container">
          <p className="user">
            <span className="current--user">
              If you don't have an account on the platform you can either use registration form or contact the administrator at sales@girc.de 
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
          <a href={homepageLink} title="Homepage">
            <img src={logo} alt={"B2B CodingIsThinking"} />
          </a>
          {search}
        </header>
      </div>
    );
  }
}

export default Header
