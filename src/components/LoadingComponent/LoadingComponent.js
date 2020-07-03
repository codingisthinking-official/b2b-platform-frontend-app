import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./LoadingComponent.css";

class LoadingComponent extends Component {
  render() {
    if (this.props.visible) {
      return <div className="container-fix-loader">
        <FontAwesomeIcon icon={ faSpinner } spin={true} />
      </div>;
    }

    return null;
  }
}

export default LoadingComponent
