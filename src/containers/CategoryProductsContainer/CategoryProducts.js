import React, { Component } from "react";
import config from "../../config";
import { withRouter } from "react-router-dom";

import AuthenticationService from "../../services/AuthenticationService";
import ProductListComponent
  from "../../components/ProductListComponent/ProductListComponent";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import LoadingComponent
  from "../../components/LoadingComponent/LoadingComponent";

class CategoryProducts extends Component {
  constructor() {
    super();
    this.state = {
      products: null,
      category: null,
      loading: true
    };
  }

  componentDidMount() {
    if (!this.props.match.params.category) {
      return;
    }

    fetch(config.api_url + '/api/category/by-name/' + this.props.match.params.category, {
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
            category: r,
            products: r.products,
            loading: false
          })
        });
      });
  }

  render() {
    if (!this.state.products || !this.state.category) {
      return null;
    }

    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer current={this.props.match.params.category} />
        <LoadingComponent visible={this.state.loading} />
        <ProductListComponent
          heading={this.state.category.name}
          products={this.state.products}
        />
      </div>
    );
  }
}

export default withRouter(CategoryProducts)
