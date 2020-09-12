import React, { Component } from "react";

import './ProductListComponent.css';
import noPhotoImage from "./no-photo.svg";

import CartService from "../../services/CartService";

class ProductComponent extends Component {
  constructor() {
    super();
    this.state = {
      quantity: 1,
      added: false
    };
  }

  render() {
    if (!this.props.product) {
      return null;
    }

    const photo = this.props.product.thumbnail ? this.props.product.thumbnail : noPhotoImage;

    let buttonAddToCart = (
      <div className="container-cart">
        <div className="quantity">
          <input type={"text"} value={this.state.quantity} readOnly={true} onChange={(e) => {
            let value = 1;
            if (e.target.value.length > 0) {
              value = parseInt(e.target.value);
            }
            this.setState({
              quantity: value
            });
          }}/>
        </div>
        <div className="button">
          <a href={"/product/" + this.props.product.id + "/"} size={"sm"} onClick={(e) => {
            CartService.addToCart(this.props.product, this.state.quantity);
            this.setState({"added": true});
            window.location = '/cart/';
            e.preventDefault();
            e.stopPropagation();
          }}>
            add to cart
          </a>
        </div>
      </div>
    );

    if (this.added || CartService.alreadyInCart(this.props.product)) {
      buttonAddToCart = (
        <div className="container-cart">
          <div className={"added"}>added to cart</div>
        </div>
      );
    }

    let productName = this.props.product.name;

    if (productName.length > 35) {
      productName = productName.substr(0, 35) + '...';
    }

    return (<div className={"product"}>
      <h4>
        <a href={"/product/" + this.props.product.id + "/"} title={this.props.product.name}>
          {productName}
        </a>
      </h4>
      <p className={"location"}><strong>Location</strong>: {this.props.product.location}</p>
      <p className={"manufacturer"}><strong>Manufacturer</strong>: {this.props.product.manufacturer}</p>
      <img src={ photo } alt={this.props.product.name}/>
      <div className="price">
        <div className="your-price">
          price
        </div>
        <div className="price-value">
          €{this.props.product.price.toFixed(2)}
        </div>
      </div>
      {buttonAddToCart}
    </div>)
  }
}

export default ProductComponent;
