import React, { Component } from "react";
import './CartComponent.css';
import SidebarContainer
  from "../../containers/SidebarContainer/SidebarContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faShoppingCart,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { Table, Button, Alert, Form, Row, Col } from "react-bootstrap";
import noPhotoImage from "../ProductListComponent/no-photo.svg";

class CartComponent extends Component {
  render() {
    if (!this.props.items) {
      return null;
    }

    let sum = 0;

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
                <td>€{i.product.price.toFixed(2)}</td>
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
                    <Form.Control as="select" custom readOnly={true}>
                      <option>Express Service</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              </Col>
              <Col lg={8}>
                <h3>2. Delivery Address</h3>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text"/>
                </Form.Group>
                <Form.Group controlId="zip">
                  <Form.Label>Postal code</Form.Label>
                  <Form.Control type="text"/>
                </Form.Group>
                <Form.Group controlId="city">
                  <Form.Label>City or town</Form.Label>
                  <Form.Control type="text"/>
                </Form.Group>
                <Form.Group controlId="street">
                  <Form.Label>Street and number</Form.Label>
                  <Form.Control type="text"/>
                </Form.Group>
                <Form.Group controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" value={"United Kingdom"}/>
                </Form.Group>
              </Col>
            </Row>
            <div className="text-right">
              <br/>
              <Button variant="info" type="submit" onClick={(e) => {
                alert('to do.');
                e.preventDefault();
                e.stopPropagation();
              }}>
                <FontAwesomeIcon icon={ faCreditCard } /> &nbsp;pay & order now
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default CartComponent
