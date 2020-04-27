import React, { Component } from "react";
import { Nav, Navbar, Form, FormControl, Button } from "react-bootstrap";
import './NavMenuComponent.css';

class NavMenuComponent extends Component {
  render() {
    return (
      <Navbar expand="md">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Products</Nav.Link>
            <Nav.Link href="/link">My orders</Nav.Link>
            <Nav.Link href="/logout">Logout</Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search for a product" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavMenuComponent
