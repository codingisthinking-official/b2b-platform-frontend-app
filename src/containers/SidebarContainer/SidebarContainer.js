import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import AuthenticationService from "../../services/AuthenticationService";

import CategorySidebarComponent
  from "../../components/CategorySidebarComponent/CategorySidebarComponent";
import config from "../../config";

class SidebarContainer extends Component {
  constructor() {
    super();
    this.state = {
      items: [
        {
          "title": "Kategorie",
          "children": []
        },
        {
          "title": "Zarządzaj kontem",
          "children": [
            {
              "title": "Edytuj mój profil",
              "url": "/manage/products/",
            },
            {
              "title": "Moje zamówienia",
              "url": "/profile/orders/",
            },
            {
              "title": "Faktury",
              "url": "/profile/invoices/",
            }
          ]
        },
        {
          "title": "Zarządzanie",
          "children": [
            {
              "title": "Zarządzaj produktami",
              "url": "/manage/products/",
            },
            {
              "title": "Zarządzaj kontami",
              "url": "/manage/subAccounts/",
            }
          ]
        }
      ],
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
    fetch(config.api_url + '/api/category/tree/', obj)
      .then(r => {
        r.json().then(r => {
          let items = this.state.items;
          let children = [];
          r.forEach((i) => {
            children.push({
              title: i.name,
              slug: i.slug,
              url: "/category/" + i.slug + "/"
            });
          });

          items[0].children = children;

          this.setState({'items': items});
        });
      });
  }

  render() {
    return (<CategorySidebarComponent items={this.state.items} current={this.props.current} />);
  }
}

export default withRouter(SidebarContainer);
