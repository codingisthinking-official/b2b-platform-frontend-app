import React, { Component } from "react";

import './ProductListComponent.css';
import ProductComponent from "./ProductComponent";

class ProductListComponent extends Component {
  render() {
    if (0 === this.props.products) {
      return null;
    }

    return (<div class={"product-container"}>{this.props.products.map((p) => {
      return <ProductComponent product={p} />
    })}</div>);
  }
}

export default ProductListComponent;
