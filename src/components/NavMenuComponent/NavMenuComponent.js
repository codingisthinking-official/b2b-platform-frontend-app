import React, { Component } from "react";
import { Form, FormControl, Button } from "react-bootstrap";

import './NavMenuComponent.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

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
            <FormControl type="text" placeholder="Szukaj produktu" className="mr-sm-4" onChange={e => {
              this.setState({"q": e.target.value});
            }}/>
            <Button variant="info" onClick={this.search.bind(this)}>
              <FontAwesomeIcon icon={ faSearch } /> szukaj
            </Button>
          </Form>
      </div>
    );
  }
}

export default NavMenuComponent
