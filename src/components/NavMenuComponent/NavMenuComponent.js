import React, { Component } from "react";
import { Nav, Navbar, Form, FormControl, Button } from "react-bootstrap";
import AuthenticationService from "../../services/AuthenticationService";

import './NavMenuComponent.css';

class NavMenuComponent extends Component {
  search() {
    window.location.href = '/products/search/' + encodeURIComponent(this.state.q) + '/';
  }

  render() {
    let auth = null;

    if (AuthenticationService.isAuthenticated()) {
      const user = AuthenticationService.getUser();

      if (user) {
        if (user.type === 1) {
          auth = (
            <Nav.Link href="/import/">Import products</Nav.Link>
          );
        }
      }
    }
    return (
      <Navbar expand="md" variant={"dark"}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">See all products</Nav.Link>
            {auth}
          </Nav>
          <Form inline onSubmit={e => {
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
