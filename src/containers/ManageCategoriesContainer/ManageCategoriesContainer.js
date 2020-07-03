
import React, { Component } from "react";
import { Button, Alert, Table } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faIndent } from '@fortawesome/free-solid-svg-icons'

import config from "../../config";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import AuthenticationService from "../../services/AuthenticationService";

import "./ManageCategoriesContainer.css";

class ManageCategoriesContainer extends Component {
  constructor() {
    super();
    this.state = {
      'categories': []
    };
  }

  fetchCategories() {
    fetch(config.api_url + '/api/category/tree/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    })
    .then(r => {
      r.json().then(r => {
        this.setState({
          'categories': r,
        })
      });
    });
  }

  removeCategory(category) {
    fetch(config.api_url + '/api/category/' + category.id + '/', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    })
    .then(r => {
      this.fetchCategories();
    });
  }

  componentDidMount() {
    this.fetchCategories();
  }

  render() {
    let products = (<Alert variant={"primary"}>No categories added yet.</Alert>);

    if (this.state.categories.length > 0) {
      const cols = this.state.categories.map((c, i) => {
        let url = '/manage/categories/' + c.id + '/edit/';
        return (<tr key={i}>
          <td>{c.id}</td>
          <td>
            <Button href={url} className={"button-edit"} variant={"primary"} size={"sm"}>
              <FontAwesomeIcon icon={ faIndent } />
            </Button> {c.name}
          </td>
          <td>
            <Button variant={"danger"} size={"sm"} onClick={(e) => {
              this.removeCategory(c);
              e.preventDefault();
              e.stopPropagation();
            }}>
              <FontAwesomeIcon icon={ faTrash } />
            </Button>
          </td>
        </tr>)
      });

      products = (<Table striped bordered hover>
        <thead>
        <tr>
          <th>#</th>
          <th>Category name</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {cols}
        </tbody>
      </Table>);
    }

    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <div className={"box-white"}>
          <h1>Manage categories</h1>
          <Button variant={"primary"} href="/manage/categories/new/">
            Add new category
          </Button>
          <br/><br/>
          {products}
        </div>
      </div>
    );
  }
}

export default ManageCategoriesContainer
