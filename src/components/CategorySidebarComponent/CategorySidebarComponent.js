import React, { Component } from "react";

import './CategorySidebarComponent.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

class CategorySidebarComponent extends Component {
  render() {
    if (!this.props.items) {
      return null;
    }

    const rootItems = this.props.items.map((i, index) => {
      return (<div key={index} className={"item"}>
        <h3><FontAwesomeIcon icon={ faChevronDown } /> {i.title}</h3>
        <ul>
          {i.children.map((c, index) => {
            if (this.props.current && c.slug === this.props.current) {
              return (<li key={index}>
                <a href={c.url} title={c.title} class={"current"}>{c.title}</a>
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
        {rootItems}
      </aside>
    );
  }
}

export default CategorySidebarComponent
