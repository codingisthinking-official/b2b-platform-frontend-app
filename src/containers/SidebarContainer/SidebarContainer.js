import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import config from "../../config";
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
          {
            "title": "Manage categories",
            "url": "/manage/categories/",
          },
          {
            "title": "Manage products",
            "url": "/manage/products/",
          }
        ]
      });
      items.push({
        "title": "Sales",
        "children": [
          {
            "title": "Orders",
            "url": "/profile/orders/",
          },
        ]
      });
      items.push({
        "title": "Account Management",
        "children": [
          {
            "title": "Edit my profile",
            "url": "/profile/edit/",
          },
          {
            "title": "Manage sub-accounts",
            "url": "/manage/subAccounts/",
          }
        ]
      });
    } else {
      // items.push({
      //   "title": "Categories",
      //   "children": [
      //     {
      //       "title": "See products",
      //       "url": "/"
      //     }
      //   ]
      // });
      items.push({
        "title": "Account Management",
        "children": [
          {
            "title": "Edit my profile",
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
      displayMenu: false,
      loading: false
    };
  }

  componentDidMount() {
    // if (!AuthenticationService.isSupplier()) {
    //   fetch(config.api_url + '/api/category/tree/', {
    //     method: 'GET',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
    //     }
    //   })
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
    //         this.setState({
    //           items: items,
    //           loading: false
    //         });
    //       });
    //     });
    // }
  }

  render() {
    return (<CategorySidebarComponent loading={this.state.loading} parent={this} items={this.state.items} current={this.props.current} />);
  }
}

export default withRouter(SidebarContainer);
