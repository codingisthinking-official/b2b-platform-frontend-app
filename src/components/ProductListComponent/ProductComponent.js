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
            this.setState({
              'quantity': parseInt(e.target.value)
            });
          }}/>
        </div>
        <div className="button">
          <a href={"/product/" + this.props.product.id + "/"} size={"sm"} onClick={(e) => {
            CartService.addToCart(this.props.product, this.state.quantity);
            this.setState({"added": true});
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

    return (<div className={"product"}>
      <h4>
        <a href={"/product/" + this.props.product.id + "/"}>
          {this.props.product.name}
        </a>
      </h4>
      <p>EAN: {this.props.product.ean}</p>
      <p class={"location"}><strong>Location</strong>: {this.props.product.location}</p>
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
