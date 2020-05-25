import React, { Component } from "react";
import { Nav, Navbar, Form, FormControl, Button } from "react-bootstrap";
import AuthenticationService from "../../services/AuthenticationService";

import './NavMenuComponent.css';

class NavMenuComponent extends Component {
  constructor() {
    super();
    this.state = {
      'q': ''
    };
  }

  search() {
    if (this.state.q.length > 0) {
      window.location.href = '/products/search/' + encodeURIComponent(this.state.q) + '/';
    }
  }

  render() {
    let auth = null;
    let subaccount = null;

    if (AuthenticationService.isAuthenticated()) {
      const user = AuthenticationService.getUser();

      if (user) {
        if (user.type === 1) {
          auth = (
            <Nav.Link href="/manage/products/" className={"btn-my-products"}>
              Manage my products
            </Nav.Link>
          );
        }
      }

      if (!user.master_account) {
        subaccount = (
          <Nav.Link href="/manage/subaccounts/" className={"btn-subaccounts"}>
            Manage subaccounts
          </Nav.Link>
        );
      }
    }

    return (
      <Navbar expand="md" variant={"dark"}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">See all products</Nav.Link>
            {subaccount}
            {auth}
          </Nav>
          <Form className={"search-desktop"} inline onSubmit={e => {
            this.search();
            e.preventDefault();
            e.stopPropagation();
          }}>
            <FormControl type="text" placeholder="Search for a product" className="mr-sm-2" onChange={e => {
              this.setState({"q": e.target.value});
            }}/>
            <Button variant="outline-success" onClick={this.search.bind(this)}>Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavMenuComponent
