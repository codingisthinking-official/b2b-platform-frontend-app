import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";

import './ProductListComponent.css';

class ProductComponent extends Component {
  render() {
    if (!this.props.product) {
      return null;
    }

    return (<div class={"product"}>
      <h4>{this.props.product.title}</h4>
      <img src={this.props.product.image} alt={this.props.product.title}/>
      <p>EAN: {this.props.product.sku}</p>

      <Button variant={"secondary"}><FontAwesomeIcon icon={ faShoppingCart }/> add to cart</Button>
    </div>)
  }
}

export default ProductComponent;
