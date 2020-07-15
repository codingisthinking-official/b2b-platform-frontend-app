import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { Button, Form, Alert } from "react-bootstrap";
import config from "../../config";

import "./EditProductContainer.css";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import AuthenticationService from "../../services/AuthenticationService";

class EditProductContainer extends Component {
  constructor() {
    super();
    this.state = {
      updated: false,
      // categories: [],
      product: {
        id: '',
        name: '',
        ean: '',
        price: '',
        location: '',
        thumbnail: '',
        // category: '',
        delivery_dates: []
      },
      errors: []
    };
  }

  componentDidMount() {
    fetch(config.api_url + '/api/product/' + this.props.match.params.productId, {
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
          product: r,
        })
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

  updateProduct(id) {
    const product = this.state.product;

    fetch(config.api_url + '/api/product/' + this.props.match.params.productId + '/', {
      method: 'PUT',
      body: JSON.stringify(product),
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
      updated = (<Alert variant={"success"}>The product has been updated.</Alert> );
    }

    return (<div className={"container--with-sidebar"}>
      <SidebarContainer />
      <div className={"box-white"}>
        <h1>Edit product</h1>
        <Button variant="light" href={"/manage/products/"}>
          Back to the product list
        </Button>
        <br/><br/>
        {updated}
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Product name</Form.Label>
            <Form.Control isInvalid={this.hasError(this.state.errors, 'name')} type="text" value={this.state.product.name} onChange={(e) => {
              let product = this.state.product;
              product.name = e.target.value;
              this.setState({
                product: product
              });
            }}/>
            <Form.Text className="text-muted">
              {this.displayErrors(this.state.errors, 'name')}
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="ean">
            <Form.Label>EAN</Form.Label>
            <Form.Control isInvalid={this.hasError(this.state.errors, 'ean')} type="text" value={this.state.product.ean} onChange={(e) => {
              let product = this.state.product;
              product.ean = e.target.value;
              this.setState({
                product: product
              });
            }}/>
            <Form.Text className="text-muted">
              {this.displayErrors(this.state.errors, 'ean')}
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="price">
            <Form.Label>Price in EUR</Form.Label>
            <Form.Control isInvalid={this.hasError(this.state.errors, 'price')} type="text" value={this.state.product.price} onChange={(e) => {
              let product = this.state.product;
              product.price = e.target.value;
              this.setState({
                product: product
              });
            }}/>
            <Form.Text className="text-muted">
              {this.displayErrors(this.state.errors, 'price')}
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="location">
            <Form.Label>Location</Form.Label>
            <Form.Control isInvalid={this.hasError(this.state.errors, 'location')} type="text" value={this.state.product.location} onChange={(e) => {
              let product = this.state.product;
              product.location = e.target.value;
              this.setState({
                product: product
              });
            }}/>
            <Form.Text className="text-muted">
              {this.displayErrors(this.state.errors, 'location')}
            </Form.Text>
          </Form.Group>
          {/*<Form.Group controlId="thumbnail">*/}
          {/*  <Form.Label>Photo</Form.Label>*/}
          {/*  <Form.Control isInvalid={this.hasError(this.state.errors, 'thumbnail')} type="text" value={this.state.product.thumbnail} onChange={(e) => {*/}
          {/*    let product = this.state.product;*/}
          {/*    product.thumbnail = e.target.value;*/}
          {/*    this.setState({*/}
          {/*      product: product*/}
          {/*    });*/}
          {/*  }}/>*/}
          {/*  <Form.Text className="text-muted">*/}
          {/*    {this.displayErrors(this.state.errors, 'thumbnail')}*/}
          {/*  </Form.Text>*/}
          {/*</Form.Group>*/}
          {/*<Form.Group controlId="category">*/}
          {/*  <Form.Label>Product category</Form.Label>*/}
          {/*  <Form.Control as="select" value={this.state.product.category} onChange={(e) => {*/}
          {/*    let product = this.state.product;*/}
          {/*    product.category = parseInt(e.target.value);*/}
          {/*    this.setState({*/}
          {/*      product: product*/}
          {/*    });*/}
          {/*  }}>*/}
          {/*    {this.state.categories.map((c, i) => {*/}
          {/*      return (<option value={c.id} key={i}>{c.name}</option>);*/}
          {/*    })}*/}
          {/*  </Form.Control>*/}
          {/*</Form.Group>*/}
          <Button variant="primary" type="submit" onClick={(e) => {
            this.updateProduct(this.state.product.id)
            e.preventDefault();
            e.stopPropagation();
          }}>
            Edit product
          </Button>
        </Form>
      </div>
    </div>)
  }
}

export default withRouter(EditProductContainer);
