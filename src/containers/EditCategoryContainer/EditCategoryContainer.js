
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { Button, Form, Alert } from "react-bootstrap";
import config from "../../config";

import SidebarContainer from "../SidebarContainer/SidebarContainer";
import AuthenticationService from "../../services/AuthenticationService";

class EditCategoryContainer extends Component {
  constructor() {
    super();
    this.state = {
      updated: false,
      category: {
        name: '',
      },
      errors: []
    };
  }

  componentDidMount() {
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
        r.forEach((c) => {
          if (c.id === parseInt(this.props.match.params.categoryId)) {
            this.setState({
              category: c
            });
          }
        });
      });
    });
  }

  hasError(errors, key) {
    let hasErrors = false;

    if (!errors) {
      return false;
    }

    let error = errors.filter((e) => {
      return e.property_path === key;
    });

    if (error.length > 0) {
      hasErrors = true;
    }

    return hasErrors;
  }

  displayErrors(errors, key) {
    let errorContainer = null;

    if (!errors) {
      return null;
    }

    let error = errors.filter((e) => {
      return e.property_path === key;
    });

    if (error.length > 0) {
      return (<span type="invalid">
        {error[0].message})
      </span>);
    }

    return errorContainer;
  }

  updateCategory(id) {
    fetch(config.api_url + '/api/category/' + id + '/edit/', {
      method: 'PUT',
      body: JSON.stringify(this.state.category),
      headers: {
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    }).then(res => {
      if (res.ok) {
        this.setState({
          updated: true,
          errors: []
        });
      } else {
        res.json().then((r) => {
          this.setState({
            errors: r
          });
        });
      }
    });

  }

  render() {
    let updated = null;

    if (this.state.updated) {
      updated = (<Alert variant={"success"}>The category has been updated.</Alert> );
    }

    return (<div className={"container--with-sidebar"}>
      <SidebarContainer />
      <div className={"box-white"}>
        <h1>Edit category</h1>
        <Button variant="light" href={"/manage/categories/"}>
          Back to the category list
        </Button>
        <br/><br/>
        {updated}
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Product name</Form.Label>
            <Form.Control isInvalid={this.hasError(this.state.errors, 'name')} type="text" value={this.state.category.name} onChange={(e) => {
              let category = this.state.category;
              category.name = e.target.value;
              this.setState({
                category: category
              });
            }}/>
            <Form.Text className="text-muted">
              {this.displayErrors(this.state.errors, 'name')}
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={(e) => {
            this.updateCategory(this.state.category.id);
            e.preventDefault();
            e.stopPropagation();
          }}>
            Save category
          </Button>
        </Form>
      </div>
    </div>)
  }
}

export default withRouter(EditCategoryContainer);
