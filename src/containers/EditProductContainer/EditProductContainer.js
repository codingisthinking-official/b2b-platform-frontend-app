import React, { Component } from "react";
import { withRouter } from "react-router-dom";

// import { Button, Alert, Table, Modal, Form } from "react-bootstrap";
// import config from "../../config";

import "./EditProductContainer.css";
import SidebarContainer from "../SidebarContainer/SidebarContainer";

class EditProductContainer extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (<div className={"container--with-sidebar"}>
      <SidebarContainer />
      <div className={"box-white"}>
        <h1>Edit product</h1>
      </div>
    </div>)
  }
}

export default withRouter(EditProductContainer);
