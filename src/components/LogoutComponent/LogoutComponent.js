import React, { Component } from "react";

import AuthenticationService from "../../services/AuthenticationService";

class LogoutComponent extends Component {
  render() {
    AuthenticationService.logout();

    window.location.href = '/';

    return null;
  }
}

export default LogoutComponent;
