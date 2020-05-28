import React, { Component } from "react";
import { Form, FormControl, Button } from "react-bootstrap";

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
    return (
      <div className={"top--search-navbar"}>
          <Form className={"search-desktop"} inline onSubmit={e => {
            this.search();
            e.preventDefault();
            e.stopPropagation();
          }}>
            <FormControl type="text" placeholder="Search for a product" className="mr-sm-2" onChange={e => {
              this.setState({"q": e.target.value});
            }}/>
            <Button variant="primary" onClick={this.search.bind(this)}>Search</Button>
          </Form>
      </div>
    );
  }
}

export default NavMenuComponent
