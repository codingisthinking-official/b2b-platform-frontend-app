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
            <Nav.Link href="/link">Orders</Nav.Link>
            <Nav.Link href="/logout">Logout</Nav.Link>
            {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
            {/*  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
            {/*  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
            {/*  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
            {/*  <NavDropdown.Divider />*/}
            {/*  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
            {/*</NavDropdown>*/}
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
