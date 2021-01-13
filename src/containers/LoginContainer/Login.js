import React, { Component } from "react";

import { Alert, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import AuthenticationService from "../../services/AuthenticationService";

import config from "../../config";

import './Login.css';
import LoadingComponent
  from "../../components/LoadingComponent/LoadingComponent";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      error: false,
      loading: false,
    };

    this.loginAutomatically();
  }

  loginAutomatically(e) {
    this.setState({
      "loading": true
    });
    fetch(config.api_url + '/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        "username": "sales+general@girc.de",
        "password": "test123"
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.ok) {
        this.setState({"error": false});
        return res.json();
      } else {
        this.setState({"error": true});
        this.setState({"loading": false});
      }
    }).then(responseJson => {
      if (responseJson) {
        AuthenticationService.authenticateWithToken(responseJson.token);

        const obj = {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + responseJson.token
          }
        };
        fetch(config.api_url + '/api/account/current/', obj)
          .then(resp => {
            resp.json().then(r => {
              if (resp.ok) {
                AuthenticationService.setUser(r);
                window.location.reload();
              }
            });
          });
      }
    });
  }

  render() {
    let error = null;

    if (this.state.error) {
      error = (<Alert variant={"danger"}>Invalid e-mail address or password.</Alert>);
    }

    return (<div className={"container container__signin"}>
      <h1 className={"display_1"}>Sign in</h1><br/>
      <div class={"alert alert-info"}>Loading platform, please wait....</div>
    </div>);
  }
}

export default Login;
