import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import AuthenticationService from "../../services/AuthenticationService";

import CategorySidebarComponent
  from "../../components/CategorySidebarComponent/CategorySidebarComponent";

class SidebarContainer extends Component {
  constructor() {
    super();
    let items = [];

    if (AuthenticationService.isSupplier()) {
      items.push({
        "title": "Manage your stock",
        "children": [
          // {
          //   "title": "Manage categories",
          //   "url": "/manage/categories/",
          // },
          {
            "title": "Manage products",
            "url": "/manage/products/",
          },
          {
            "title": "Manage sub-accounts",
            "url": "/manage/subAccounts/",
          }
        ]
      });
      items.push({
        "title": "Account Management",
        "children": [
          {
            "title": "Edit profile",
            "url": "/profile/edit/",
          }
        ]
      });
    } else {
      items.push({
        "title": "Stock on Fire",
        "children": [
          {
            "title": "See products",
            "url": "/"
          }
        ]
      });
      items.push({
        "title": "Account Management",
        "children": [
          {
            "title": "My profile",
            "url": "/profile/edit/",
          },
          {
            "title": "My orders",
            "url": "/profile/orders/",
          },
          {
            "title": "Invoices",
            "url": "/profile/invoices/",
          }
        ]
      });
    }

    this.state = {
      items: items,
      displayMenu: false
    };
  }

  componentDidMount() {
    // const obj = {
    //   method: 'GET',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
    //   }
    // };
    // if (!AuthenticationService.isSupplier()) {
    //   fetch(config.api_url + '/api/category/tree/', obj)
    //     .then(r => {
    //       r.json().then(r => {
    //         let items = this.state.items;
    //         let children = [];
    //         r.forEach((i) => {
    //           children.push({
    //             title: i.name,
    //             slug: i.slug,
    //             url: "/category/" + i.slug + "/"
    //           });
    //         });
    //
    //         items[0].children = children;
    //
    //         this.setState({'items': items});
    //       });
    //     });
    // }
  }

  render() {
    return (<CategorySidebarComponent parent={this} items={this.state.items} current={this.props.current} />);
  }
}

export default withRouter(SidebarContainer);
