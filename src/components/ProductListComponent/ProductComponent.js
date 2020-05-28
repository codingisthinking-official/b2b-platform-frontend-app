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
          <input type={"text"} value={this.state.quantity} onChange={(e) => {
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
            do koszyka
          </a>
        </div>
      </div>
    );

    if (this.added || CartService.alreadyInCart(this.props.product)) {
      buttonAddToCart = (
        <div className="container-cart">
          <div className={"added"}>produkt w koszyku</div>
        </div>
      );
    }

    return (<div className={"product"}>
      <h4>
        <a href={"/product/" + this.props.product.id + "/"}>
          {this.props.product.name}
        </a>
      </h4>
      <p>{this.props.product.ean}</p>
      <img src={ photo } alt={this.props.product.name}/>
      <div className="price">
        <div className="your-price">
          cena
        </div>
        <div className="price-value">
          {this.props.product.price.toFixed(2)} zł netto<br/>
          {(this.props.product.price * 1.23).toFixed(2)} zł brutto
        </div>
      </div>
      {buttonAddToCart}
    </div>)
  }
}

export default ProductComponent;
