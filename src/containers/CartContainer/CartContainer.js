import React, { Component } from "react";

import CartService from "../../services/CartService";
import StaticPageContainer from "../StaticPageContainer/StaticPageContainer";
import CartComponent from "../../components/CartComponent/CartComponent";

class CartContainer extends Component {
  constructor() {
    super();
    this.state = {
      'items': CartService.getCart(),
    };
  }

  removeElementFromCart(product) {
    CartService.removeProduct(product);
    this.setState({
      'items': CartService.getCart(),
    });
  }

  render() {
    if (!this.state.items) {
      return <StaticPageContainer heading={"Koszyk"} text={"Brak produktów w koszyku"} />;
    }

    return <CartComponent items={this.state.items} parent={this} />;
  }
}

export default CartContainer;
