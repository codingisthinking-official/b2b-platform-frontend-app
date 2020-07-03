import React, { Component } from "react";

import './CategorySidebarComponent.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronDown, faHamburger} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

class CategorySidebarComponent extends Component {
  constructor() {
    super();
    this.state = {
      'isMobile': (window.innerWidth < 990)
    };
  }

  componentDidMount() {
    var self = this;
    window.addEventListener('resize', function() {
      self.setState({
        'isMobile': (window.innerWidth < 990)
      });
    });
  }

  render() {
    if (!this.props.items) {
      return null;
    }

    let displayItems = true;
    if (this.state.isMobile && !this.props.parent.state.displayMenu) {
      displayItems = false;
    }

    const rootItems = this.props.items.map((i, index) => {
      const isFirst = (index === 0) ? ' first' : '';
      return (<div key={index} className={"item" + isFirst} style={{
        display: (displayItems ? 'block' : 'none')
      }}>
        <h3><FontAwesomeIcon icon={ faChevronDown } /> {i.title}</h3>
        <ul>
          {i.children.map((c, index) => {
            if (this.props.current && c.slug === this.props.current) {
              return (<li key={index}>
                <a href={c.url} title={c.title} className={"current"}>{c.title}</a>
              </li>);
            } else {
              return (<li key={index}>
                <a href={c.url} title={c.title}>{c.title}</a>
              </li>);
            }
          })}
        </ul>
      </div>);
    });

    return (
      <aside className={"category--sidebar"}>
        <LoadingComponent visible={this.props.loading} />
        <div className="sidebar-mobile-icon">
          <Button variant={"secondary"} onClick={(e) => {
            this.props.parent.setState({
              displayMenu: !this.props.parent.state.displayMenu
            });
            e.preventDefault();
            e.stopPropagation();
          }}>
            <FontAwesomeIcon icon={ faHamburger } /> menu
          </Button>
        </div>
        {rootItems}
      </aside>
    );
  }
}

export default CategorySidebarComponent
