import React, { Component } from "react";

import './ProductListComponent.css';
import ProductComponent from "./ProductComponent";

class ProductListComponent extends Component {
  render() {
    if (!this.props.products) {
      return null;
    }

    return (<div className={"product-container"}>{this.props.products.map((p, i) => {
      return <ProductComponent key={i} product={p} />
    })}</div>);
  }
}

export default ProductListComponent;
