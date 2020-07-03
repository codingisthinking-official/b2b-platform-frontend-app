import React, { Component } from "react";
import config from "../../config";
import './CartComponent.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import stripeLogo from "./stripe-logo.png";

import {
  faCreditCard,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

import { Table, Button, Alert, Form, Row, Col } from "react-bootstrap";
import noPhotoImage from "../ProductListComponent/no-photo.svg";
import AuthenticationService from "../../services/AuthenticationService";
import SidebarContainer from "../../containers/SidebarContainer/SidebarContainer";
import CartService from "../../services/CartService";

class CartComponent extends Component {
  constructor() {
    super();
    this.state = {
      address: {
        name: "",
        postal_code: "",
        city: "",
        street: "",
        country: "United Kingdom"
      },
      errors: null,
      cards: [],
    };

    this.refreshCreditCards()
  }

  refreshCreditCards() {
    fetch(config.api_url + '/api/payment/credit_cards/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    }).then(r => {
      r.json().then(r => {
        this.setState({
          cards: r
        });
      });
    });
  }

  sendOrder() {
    let requestBody = {
      "products": this.props.items.map((i) => {
        return {
          "product_id": i.product.id,
          "quantity": i.quantity
        };
      }),
      "delivery": {
        "method": "express",
        "address": this.state.address
      }
    };
    const obj = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken(),
      },
      body: JSON.stringify(requestBody),
    };
    fetch(config.api_url + '/api/order/', obj)
      .then(res => {
        if (res.ok) {
          res.json().then((e) => {
            CartService.refine();
            window.location.href = '/profile/orders/';
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
      return (<Form.Control.Feedback type="invalid">
        {error[0].message}
      </Form.Control.Feedback>);
    }

    return errorContainer;
  }

  render() {
    if (!this.props.items) {
      return null;
    }

    let sum = 0;
    let creditCardAlert = null;

    if (this.state.cards.length === 0) {
      creditCardAlert = (<Alert variant={"danger"} className={"credit-card-first"}>
        You need to connect your credit card to the account first.
      </Alert>);
    }

    return (
      <div className={"container--with-sidebar container--cart"}>
        <SidebarContainer />
        <div className={"box-white"}>
          <h1 className={"product--container-heading"}>
            My cart
          </h1>
          <div className="limits">
            <FontAwesomeIcon icon={ faCreditCard } /> Your payment method is: <strong>Credit Cart</strong>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {this.props.items.map((i, index) => {
              const photo = i.product.thumbnail ? i.product.thumbnail : noPhotoImage;
              sum += i.product.price * i.quantity;

              return (<tr key={index}>
                <td>
                  <img src={ photo } alt={i.product.name}/>
                  {i.product.name}
                </td>
                <td>{i.quantity}</td>
                <td>€{(i.quantity * i.product.price).toFixed(2)}</td>
                <td>
                  <Button variant={"danger"} size={"sm"} onClick={(e) => {
                    this.props.parent.removeElementFromCart(i.product);
                    e.stopPropagation();
                    e.preventDefault();
                  }}>
                    <FontAwesomeIcon icon={ faTrash } />
                  </Button>
                </td>
              </tr>);
            })}
            </tbody>
          </Table>
          <Alert variant={"primary"}>
            Total: €{sum.toFixed(2)}
          </Alert>
          <Form>
            <Row className={"order-information"}>
              <Col lg={4}>
                <h3>1. Order details</h3>
                <div>
                  <strong>Total price to pay</strong>: €{sum.toFixed(2)}
                </div>
                <br/>
                <div>
                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label><strong>Delivery method</strong></Form.Label>
                    <Form.Control as="select">
                      <option>Express Service</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              </Col>
              <Col lg={8}>
                <h3>2. Delivery Address</h3>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control isInvalid={this.hasError(this.state.errors, 'delivery.address.name')} type="text" value={this.state.address.name} onChange={(e) => {
                    let currentStateAddress = this.state.address;
                    currentStateAddress.name = e.target.value;
                    this.setState({
                      "address": currentStateAddress
                    });
                  }}/>
                  {this.displayErrors(this.state.errors, 'delivery.address.name')}
                </Form.Group>
                <Form.Group controlId="zip">
                  <Form.Label>Postal code</Form.Label>
                  <Form.Control isInvalid={this.hasError(this.state.errors, 'delivery.address.postalCode')} type="text" value={this.state.address.postal_code} onChange={(e) => {
                    let currentStateAddress = this.state.address;
                    currentStateAddress.postal_code = e.target.value;
                    this.setState({
                      "address": currentStateAddress
                    });
                  }}/>
                  {this.displayErrors(this.state.errors, 'delivery.address.postalCode')}
                </Form.Group>
                <Form.Group controlId="city">
                  <Form.Label>City or town</Form.Label>
                  <Form.Control isInvalid={this.hasError(this.state.errors, 'delivery.address.city')} type="text" value={this.state.address.city} onChange={(e) => {
                    let currentStateAddress = this.state.address;
                    currentStateAddress.city = e.target.value;
                    this.setState({
                      "address": currentStateAddress
                    });
                  }}/>
                  {this.displayErrors(this.state.errors, 'delivery.address.city')}
                </Form.Group>
                <Form.Group controlId="street">
                  <Form.Label>Street and number</Form.Label>
                  <Form.Control isInvalid={this.hasError(this.state.errors, 'delivery.address.street')} type="text" value={this.state.address.street} onChange={(e) => {
                    let currentStateAddress = this.state.address;
                    currentStateAddress.street = e.target.value;
                    this.setState({
                      "address": currentStateAddress
                    });
                  }}/>
                  {this.displayErrors(this.state.errors, 'delivery.address.street')}
                </Form.Group>
                <Form.Group controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" value={this.state.address.country} onChange={(e) => {
                    let currentStateAddress = this.state.address;
                    currentStateAddress.country = e.target.value;
                    this.setState({
                      "address": currentStateAddress
                    });
                  }}/>
                </Form.Group>
              </Col>
            </Row>
            <h3>3. Invoice data & payment</h3>
            <div>
              Your VAT number, company name and address will be taken from your profile.
              You can change it in <a href={"/profile/edit/"}>edit profile section</a>.

              <br/><br/>

              You need to have your Credit card connected <a href={"/profile/edit/"}>in your profile section</a>.
              {creditCardAlert}
            </div>
            <div className="text-right">
              <br/>
              <Button disabled={this.props.items.length === 0 || this.state.cards.length === 0} variant="info" type="submit" onClick={(e) => {
                this.sendOrder();
                e.preventDefault();
                e.stopPropagation();
              }}>
                <FontAwesomeIcon icon={ faCreditCard } /> &nbsp;pay & order now
              </Button>
              <br/><br/>
              Payment provider:
              <img src={stripeLogo} alt={"Stripe payments"} className={"stripe-payment-logo"} style={{
                "height": "30px",
                "margin-left": "20px",
                "position": "relative",
                "top": "-2px"
              }}/>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default CartComponent
