import React, { Component } from "react";
import config from "../../config";

import AuthenticationService from "../../services/AuthenticationService";
import ProductListComponent
  from "../../components/ProductListComponent/ProductListComponent";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import LoadingComponent
  from "../../components/LoadingComponent/LoadingComponent";

class HomepageContainer extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      loading: true
    };

    if (AuthenticationService.isSupplier()) {
      window.location.href = '/manage/products/';
    }
  }

  componentDidMount() {
    fetch(config.api_url + '/api/products/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    })
      .then(r => {
        r.json().then(r => {
          this.setState({
            products: r,
            loading: false
          })
        });
      });
  }

  render() {
    if (0 === this.state.products.length) {
      return null;
    }

    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <LoadingComponent visible={this.state.loading} />
        <ProductListComponent heading={"Recently added products"} products={this.state.products} />
      </div>
    );
  }
}

export default HomepageContainer
