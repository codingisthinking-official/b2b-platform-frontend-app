import React, { Component } from "react";
import config from "../../config";
import { withRouter } from "react-router-dom";

import AuthenticationService from "../../services/AuthenticationService";

import "./ProductContainer.css";
import noPhotoImage from "../../components/ProductListComponent/no-photo.svg";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import CartService from "../../services/CartService";
import LoadingComponent
  from "../../components/LoadingComponent/LoadingComponent";

class ProductContainer extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      product: {},
      showModal: false,
      added: false,
      quantity: 1
    };
  }

  componentDidMount() {
    const obj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    };
    fetch(config.api_url + '/api/product/' + this.props.match.params.productId + '/', obj)
      .then(r => {
        r.json().then(r => {
          this.setState({
            product: r,
            loading: false
          })
        });
      });
  }

  setShow(show) {
    this.setState({'showModal': show});
  }

  render() {
    if (!this.state.product) {
      return null;
    }

    const photo = this.state.product.thumbnail ? this.state.product.thumbnail : noPhotoImage;

    let buttonAddToCart = (
      <div className="container-cart">
        <div className="quantity">
          <input type={"text"} readOnly={true} value={this.state.quantity} onChange={(e) => {
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
          <a href={"/product/" + this.state.product.id + "/"} size={"sm"} onClick={(e) => {
            CartService.addToCart(this.state.product, this.state.quantity);
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

    if (this.added || CartService.alreadyInCart(this.state.product)) {
      buttonAddToCart = (
        <div className="container-cart">
          <div className={"added"}>added to cart</div>
        </div>
      );
    }

    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <LoadingComponent visible={this.state.loading} />
        <div className={"box-white"}>
          <h1>{this.state.product.name}</h1>
          <div className="product-box">
            <div className="thumbnail">
              <img src={ photo } alt={this.state.product.name}/>
            </div>
            <div className="description">
              <strong>Product:</strong> {this.state.product.name}<br/>
              <strong>Manufacturer:</strong> {this.state.product.manufacturer}<br/>
              <strong>Location:</strong> {this.state.product.location}<br/>
              <strong>Lead time:</strong> {this.state.product.leadtime}<br/>
              <strong>In stock:</strong> {this.state.product.available}<br/>
              <div className="order">
                Price: € {this.state.product.price}
                {buttonAddToCart}
              </div>
            </div>
          </div>
          <div className="product-box-tab">
            {this.state.product.description}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductContainer);
