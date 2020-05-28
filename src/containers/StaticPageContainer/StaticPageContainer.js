import React, { Component } from "react";
import SidebarContainer from "../SidebarContainer/SidebarContainer";

import { Alert } from "react-bootstrap";

class StaticPageContainer extends Component {
  render() {
    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <div className={"box-white"}>
          <h1 className={"product--container-heading"}>{this.props.heading}</h1>
          <Alert variant={"info"}>{this.props.text}</Alert>
        </div>
      </div>
    );
  }
}

export default StaticPageContainer;
