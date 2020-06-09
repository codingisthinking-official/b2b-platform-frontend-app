import React, { Component } from "react";
import config from "../../config";
import AuthenticationService from "../../services/AuthenticationService";
import { withRouter } from "react-router-dom";
import { Alert, Table } from "react-bootstrap";
import SidebarContainer from "../SidebarContainer/SidebarContainer";

class ProfileOrdersContainer extends Component {
  constructor() {
    super();
    this.state = {
      'orders': [],
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
              'orders': r,
            })
          });
        });
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
              <div key={i}>{p.quantity}x {p.product_id}</div>
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

//         const invoiceAddress = (<div></div>);
        return (<tr key={i}>
          <td>{o.id}</td>
          <td>
          <strong>Products:</strong><br/>
          {products}<br/>
          <strong>Delivery Address:</strong><br/>
          {deliveryAddress}<br/>
{/*           <strong>Invoice Address:</strong><br/> */}
{/*           {invoiceAddress} */}
          </td>
        </tr>);
      });

      ordersTable = (<Table>
        <thead>
          <tr>
            <th>Order no</th>
            <th>Your order</th>
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
        <h1>My orders</h1>
        {alert}
        {ordersTable}
      </div>
    </div>);
  }
}

export default withRouter(ProfileOrdersContainer);