import React, { Component } from "react";
import config from "../../config";
import { withRouter } from "react-router-dom";

import AuthenticationService from "../../services/AuthenticationService";

import "./ProductContainer.css";
import noPhotoImage from "../../components/ProductListComponent/no-photo.svg";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import CartService from "../../services/CartService";

class ProductContainer extends Component {
  constructor() {
    super();
    this.state = {
      'product': {},
      'showModal': false,
      'added': false,
      'quantity': 1
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
    fetch(config.api_url + '/api/product/' + this.props.match.params.productId, obj)
      .then(r => {
        r.json().then(r => {
          this.setState({
            'product': r,
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

    const handleClose = () => this.setShow(false);
    const photo = this.state.product.thumbnail ? this.state.product.thumbnail : noPhotoImage;

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
          <a href={"/product/" + this.state.product.id + "/"} size={"sm"} onClick={(e) => {
            CartService.addToCart(this.state.product, this.state.quantity);
            this.setState({"added": true});
            e.preventDefault();
            e.stopPropagation();
          }}>
            do koszyka
          </a>
        </div>
      </div>
    );

    if (this.added || CartService.alreadyInCart(this.state.product)) {
      buttonAddToCart = (
        <div className="container-cart">
          <div className={"added"}>produkt w koszyku</div>
        </div>
      );
    }

    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <div className={"box-white"}>
          <h1>{this.state.product.name}</h1>
          <div className="product-box">
            <div className="thumbnail">
              <img src={ photo } alt={this.state.product.name}/>
              <div className="order">
                cena: {this.state.product.price} zł netto
                <small>z uwzględnieniem rabatów</small>
                {buttonAddToCart}
              </div>
            </div>
            <div className="description">
              <p><strong>Produkt:</strong> {this.state.product.name}</p>
              <p><strong>Kod producenta:</strong> {this.state.product.ean}</p>
              <p><strong>Czas dostawy:</strong> 3-5 dni roboczych</p>
              <p className="short-description">
                Lorem ipsum dolor sit amet enim. Etiam ullamcorper.
                Suspendisse a pellentesque <strong>dui, non felis. Maecenas malesuada</strong>
                elit lectus felis, malesuada ultricies. Curabitur et ligula.
                Suspendisse a pellentesque <strong>dui, non felis. Maecenas malesuada</strong>
                elit lectus felis, malesuada ultricies. Curabitur et ligula.
              </p>
            </div>
            <div className="long-description">
              <h3>Opis produktu</h3>
              <p>
                Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.
                <br/><br/>
                Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi. Aliquam erat ac ipsum. Integer aliquam purus. Quisque lorem tortor fringilla sed, vestibulum id.
                <br/><br/>
                <strong>Eleifend justo vel bibendum sapien massa ac turpis faucibus</strong> orci luctus non, consectetuer lobortis quis, varius in, purus. Integer ultrices posuere cubilia Curae, Nulla ipsum dolor lacus, suscipit adipiscing. Cum sociis natoque penatibus et ultrices volutpat. Nullam wisi ultricies a, gravida vitae, dapibus risus ante sodales lectus blandit eu, tempor diam pede cursus vitae, ultricies eu, faucibus quis, porttitor eros cursus lectus, pellentesque eget, bibendum a, gravida ullamcorper quam. Nullam viverra consectetuer. Quisque cursus et, porttitor risus. Aliquam sem. In hendrerit nulla quam nunc, accumsan congue. Lorem ipsum primis in nibh vel risus. Sed vel lectus. Ut sagittis, ipsum dolor quam.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductContainer);
