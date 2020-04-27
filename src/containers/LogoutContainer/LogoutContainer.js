import { Component } from "react";

import AuthenticationService from "../../services/AuthenticationService";

class LogoutContainer extends Component {
  render() {
    AuthenticationService.logout();

    window.location.href = '/';

    return null;
  }
}

export default LogoutContainer;
