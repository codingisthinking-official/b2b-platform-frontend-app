import React, { Component } from "react";
import config from "../../config";

import AuthenticationService from "../../services/AuthenticationService";
import ProductListComponent
  from "../../components/ProductListComponent/ProductListComponent";

class HomepageContainer extends Component {
  constructor() {
    super();
    this.state = {
      'products': []
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
    fetch(config.api_url + '/api/category/tree', obj)
      .then(r => {
        this.setState({
          'products': [
            {
              'id': 1,
              'title': 'CISCO EA1100FF33',
              'price': 9900,
              'sku': 'EA1100FF33',
              'location': 'London',
              'image': 'https://picsum.photos/200'
            },
            {
              'id': 1,
              'title': 'Samsung EA1100FF23',
              'price': 1350.99,
              'sku': 'EA1100FF23',
              'location': 'New York',
              'image': 'https://picsum.photos/200'
            }
          ]
        })
      });
  }


  render() {
    if (0 === this.state.products.length) {
      return null;
    }

    return <ProductListComponent products={this.state.products} />;
  }
}

export default HomepageContainer
