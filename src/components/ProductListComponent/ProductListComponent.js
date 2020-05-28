import React, { Component } from "react";

import './ProductListComponent.css';
import ProductComponent from "./ProductComponent";

class ProductListComponent extends Component {
  render() {
    if (this.props.products === null) {
      return null;
    }

    let heading = null;

    if (this.props.heading) {
      heading = (<h2 className={"product--container-heading"}>{this.props.heading}</h2>)
    }

    return (<div className={"product-container"}>
      {heading}
      {this.props.products.map((p, i) => {
      return <ProductComponent key={i} product={p} />
    })}</div>);
  }
}

export default ProductListComponent;
