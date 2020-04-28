import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";

import './ProductListComponent.css';

class ProductComponent extends Component {
  render() {
    if (!this.props.product) {
      return null;
    }

    return (<div className={"product"}>
      <h4>{this.props.product.name}</h4>
      <img src={this.props.product.thumbnail} alt={this.props.product.name}/>
      <p>EAN: {this.props.product.ean}</p>
      <p>Location: {this.props.product.location}</p>

      <Button variant={"secondary"} href={"/product/" + this.props.product.id + "/"} size={"sm"}>
        <FontAwesomeIcon icon={ faEye } /> Check product
      </Button>
    </div>)
  }
}

export default ProductComponent;
