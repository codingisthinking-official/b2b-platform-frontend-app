import React, { Component } from "react";
import config from "../../config";
import AuthenticationService from "../../services/AuthenticationService";
import { withRouter } from "react-router-dom";
import { Alert, Table, Button, Form } from "react-bootstrap";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

import "./ProfileOrdersContainer.css";

class ProfileOrdersContainer extends Component {
  constructor() {
    super();
    this.state = {
      'orders': [],
      'products': [],
    };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders() {
    const obj = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
        }
      };
      fetch(config.api_url + '/api/orders/', obj)
        .then(r => {
          r.json().then(r => {
            this.setState({
              'orders': r.orders,
              'products': r.products,
            })
          });
        });
  }

  payOrder(order) {
    fetch(config.api_url + '/api/payment/create/', {
      method: 'POST',
      body: JSON.stringify({
        order: order.id
      }),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    }).then(res => {
      if (res.ok) {
        this.fetchOrders();
      }
    });
  }

  updateOrderStatus(orderId, orderStatusId) {
    fetch(config.api_url + '/api/orders/' + orderId + '/', {
      method: 'PUT',
      body: JSON.stringify({
        status: orderStatusId
      }),
      headers: {
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    }).then((r) => {
      this.fetchOrders();
    });
  }

  findProductNameById(id) {
    return this.state.products[id].name;
  }


  findProductEanById(id) {
    return this.state.products[id].ean;
  }

  render() {
    let alert = null;
    let ordersTable = null;

    if (!this.state.orders || this.state.orders.length === 0) {
      alert = <Alert variant={"danger"}>No orders yet</Alert>;
    } else {
      const cols = this.state.orders.map((o, i) => {
        let products = null;
        if (o.products) {
          products = o.products.map((p, i) => {
            return (
              <div key={i} className={"product-cart-item"}>
                {p.quantity}x {this.findProductNameById(p.product_id)}
                <br/>
                <small>
                  SKU: {this.findProductEanById(p.product_id)}
                </small>
              </div>
            )
          });
        } else {
          products = null;
        }

        const deliveryAddress = (
          <div>
            {o.delivery_address.name}<br/>
            {o.delivery_address.zip_code} {o.delivery_address.city}<br/>
            {o.delivery_address.street}
          </div>
        );

        let invoiceAddress = null;

        if (o.invoice_address) {
          invoiceAddress = (<div>
            <h3>Invoice address</h3>
            {o.invoice_address.name}<br/>
            {o.invoice_address.zip_code} {o.invoice_address.city}<br/>
            {o.invoice_address.street}<br/>
            VAT: {o.invoice_address.vat}
          </div>);
        }

        let changeStatusForm = null;
        let paymentStatus = (
          <div class="paid">
            <FontAwesomeIcon icon={ faCheck } className="paid"/> paid
          </div>
        );

        if (o.paid === false) {
          let payButton = null;
          if (!AuthenticationService.isSupplier()) {
            payButton = (<div>
              <br/>
              <Button size={"sm"} variant={"outline-primary"} onClick={(e) => {
                this.payOrder(o);
                e.preventDefault();
                e.stopPropagation();
              }}>Pay for the order</Button>
            </div>);
          }

          paymentStatus = (
            <div class="unpaid">
              <FontAwesomeIcon icon={ faTimes } className="unpaid" /> not paid
              {payButton}
            </div>
          );
        }

        if (AuthenticationService.isSupplier()) {
          changeStatusForm = (<div className={"order--status"}>
          <strong>Order Status:</strong>
          <br/><br/>
          <Form.Group>
            <Form.Control as="select" value={o.status} onChange={(e) => {
              this.updateOrderStatus(o.id, e.target.value);
            }}>
              <option value="0">new</option>
              <option value="1">in progress</option>
              <option value="2">sent</option>
              <option value="3">returned</option>
            </Form.Control>
          </Form.Group>
          </div>);
        } else {
          let orderStatusText = 'New order';

          if (o.status === 1) {
            orderStatusText = 'In progress';
          }

          if (o.status === 2) {
            orderStatusText = 'Sent';
          }

          if (o.status === 3) {
            orderStatusText = 'Returned';
          }

          changeStatusForm = (<div className={"order--status"}>
            <strong>Order Status:</strong> {orderStatusText}
          </div>);
        }

        return (<tr key={i}>
          <td>
            <h3>Products</h3>
            {products}<br/>
            <h3>Delivery address</h3>
            {deliveryAddress}<br/>
            {invoiceAddress}
          </td>
          <td className={"payment-status"}>
            {changeStatusForm}
            {paymentStatus}
          </td>
        </tr>);
      });

      ordersTable = (<Table className={"table--items"} hover={true}>
        <thead>
          <tr>
            <th>Your order</th>
            <th>Payment and order</th>
          </tr>
        </thead>
        <tbody>
          {cols}
        </tbody>
      </Table>)
    }

    return (<div className={"container--with-sidebar"}>
      <SidebarContainer />
      <div className={"box-white"}>
        <h1>Orders</h1>
        {alert}
        {ordersTable}
      </div>
    </div>);
  }
}

export default withRouter(ProfileOrdersContainer);
