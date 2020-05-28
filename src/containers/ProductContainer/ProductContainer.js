import React, { Component } from "react";
import config from "../../config";
import { withRouter } from "react-router-dom";

import { Form, Button, Modal } from "react-bootstrap";

import AuthenticationService from "../../services/AuthenticationService";

import "./ProductContainer.css";
import noPhotoImage from "../../components/ProductListComponent/no-photo.svg";
import SidebarContainer from "../SidebarContainer/SidebarContainer";

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
    const photo = this.state.product.thumbnail ? this.state.product.thumbnail : noPhotoImage;

    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <div className={"box-white"}>
          <h1>{this.state.product.name}</h1>
          <p>EAN: {this.state.product.ean}</p>
          <p>Location: {this.state.product.location}</p>
          <p className="price">Price &euro;{this.state.product.price}</p>
          <img src={ photo } alt={this.state.product.name}/>

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
        <Modal show={this.state.showModal} onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>Order confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Thank you for your order. We will contact you as soon as possible.
            <br/><br/>
            The message (and push notification) will be send to the owner (supplier) of the product.
          </Modal.Body>
          <Modal.Footer className={"modal__footer-line-light"}>
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
