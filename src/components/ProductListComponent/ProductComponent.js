import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";

import './ProductListComponent.css';
import noPhotoImage from "./no-photo.svg";

class ProductComponent extends Component {
  render() {
    if (!this.props.product) {
      return null;
    }

    const photo = this.props.product.thumbnail ? this.props.product.thumbnail : noPhotoImage;

    return (<div className={"product"}>
      <h4>{this.props.product.name}</h4>

      <img src={ photo } alt={this.props.product.name}/>
      <p>EAN: {this.props.product.ean}</p>
      <p>Location: {this.props.product.location}</p>

      <Button variant={"secondary"} href={"/product/" + this.props.product.id + "/"} size={"sm"}>
        <FontAwesomeIcon icon={ faEye } /> Check product
      </Button>
    </div>)
  }
}

export default ProductComponent;
