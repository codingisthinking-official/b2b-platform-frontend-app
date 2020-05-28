import React, { Component } from "react";
import config from "../../config";
import { withRouter } from "react-router-dom";

import AuthenticationService from "../../services/AuthenticationService";
import ProductListComponent
  from "../../components/ProductListComponent/ProductListComponent";
import SidebarContainer from "../SidebarContainer/SidebarContainer";

class CategoryProducts extends Component {
  constructor() {
    super();
    this.state = {
      'products': null,
      'category': null
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
    fetch(config.api_url + '/api/category/by-name/' + this.props.match.params.category, obj)
      .then(r => {
        r.json().then(r => {
          this.setState({
            'category': r,
            'products': r.products,
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
        <ProductListComponent
          heading={this.state.category.name}
          products={this.state.products}
        />
      </div>
    );
  }
}

export default withRouter(CategoryProducts)
