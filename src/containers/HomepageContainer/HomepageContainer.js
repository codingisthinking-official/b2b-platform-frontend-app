import React, { Component } from "react";
import config from "../../config";

import AuthenticationService from "../../services/AuthenticationService";
import ProductListComponent
  from "../../components/ProductListComponent/ProductListComponent";
import SidebarContainer from "../SidebarContainer/SidebarContainer";

class HomepageContainer extends Component {
  constructor() {
    super();
    this.state = {
      'products': []
    };

    if (AuthenticationService.isSupplier()) {
      window.location.href = '/manage/products/';
    }
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
    fetch(config.api_url + '/api/products/', obj)
      .then(r => {
        r.json().then(r => {
          this.setState({
            'products': r,
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
        <ProductListComponent heading={"Najnowsze produkty"} products={this.state.products} />
      </div>
    );
  }
}

export default HomepageContainer
