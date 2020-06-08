import React, { Component } from "react";
import config from "../../config";
import { withRouter } from "react-router-dom";

import AuthenticationService from "../../services/AuthenticationService";

import "./ProductContainer.css";
import noPhotoImage from "../../components/ProductListComponent/no-photo.svg";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import CartService from "../../services/CartService";

class ProductContainer extends Component {
  constructor() {
    super();
    this.state = {
      'product': {},
      'showModal': false,
      'added': false,
      'quantity': 1
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

    const photo = this.state.product.thumbnail ? this.state.product.thumbnail : noPhotoImage;

    let buttonAddToCart = (
      <div className="container-cart">
        <div className="quantity">
          <input type={"text"} value={this.state.quantity} onChange={(e) => {
            this.setState({
              'quantity': parseInt(e.target.value)
            });
          }}/>
        </div>
        <div className="button">
          <a href={"/product/" + this.state.product.id + "/"} size={"sm"} onClick={(e) => {
            CartService.addToCart(this.state.product, this.state.quantity);
            this.setState({"added": true});
            e.preventDefault();
            e.stopPropagation();
          }}>
            add to cart
          </a>
        </div>
      </div>
    );

    if (this.added || CartService.alreadyInCart(this.state.product)) {
      buttonAddToCart = (
        <div className="container-cart">
          <div className={"added"}>added to cart</div>
        </div>
      );
    }

    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <div className={"box-white"}>
          <h1>{this.state.product.name}</h1>
          <div className="product-box">
            <div className="thumbnail">
              <img src={ photo } alt={this.state.product.name}/>
              <div className="order">
                price: €{this.state.product.price}
                {buttonAddToCart}
              </div>
            </div>
            <div className="description">
              <p><strong>Product:</strong> {this.state.product.name}</p>
              <p><strong>EAN:</strong> {this.state.product.ean}</p>
              <p><strong>Location:</strong> {this.state.product.location}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductContainer);
