import React, { Component } from "react";
import config from "../../config";
import { withRouter } from "react-router-dom";

import { Form, Button, Modal } from "react-bootstrap";

import AuthenticationService from "../../services/AuthenticationService";

import "./ProductContainer.css";

class ProductContainer extends Component {
  constructor() {
    super();
    this.state = {
      'product': {},
      'showModal': false
    };
  }

  componentDidMount() {
    const obj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    };
    fetch(config.api_url + '/api/product/' + this.props.match.params.productId, obj)
      .then(r => {
        r.json().then(r => {
          this.setState({
            'product': r,
          })
        });
      });
  }

  setShow(show) {
    this.setState({'showModal': show});
  }

  render() {
    if (!this.state.product) {
      return null;
    }

    const handleClose = () => this.setShow(false);
    return (
      <div>
        <div className={"box-white"}>
          <h1>{this.state.product.name}</h1>
          <p>EAN: {this.state.product.ean}</p>
          <p>Location: {this.state.product.location}</p>
          <p className="price">Price &euro;{this.state.product.price}</p>
          <img src={this.state.product.thumbnail} alt={this.state.product.name}/>

          <h2>Order now</h2>

          <Form className={"order-now"} onSubmit={(e) => {
            this.setState({'showModal': true});
            e.preventDefault();
            e.stopPropagation();
          }}>
            <Form.Group controlId="orderForm.text">
              <Form.Label>Additional text</Form.Label>
              <Form.Control as="textarea" rows="3" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Order now
            </Button>
          </Form>
        </div>
        <Modal show={this.state.showModal} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Order confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Thank you for your order. We will contact you as soon as possible.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withRouter(ProductContainer);
