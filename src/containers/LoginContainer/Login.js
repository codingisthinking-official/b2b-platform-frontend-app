import React, { Component } from "react";

import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import AuthenticationService from "../../services/AuthenticationService";

import config from "../../config";

import './Login.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      error: false,
      loading: false,
    };
  }

  // Default developement-time data are: | login | test1@test.com | | password | P@$$w0rd |
  sendLoginRequest(e) {
    this.setState({
      "loading": true
    });
    fetch(config.api_url + '/api/auth', {
      method: 'POST',
      body: JSON.stringify(this.state),
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
        window.location.reload();
      }
    });

    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    let error = null;
    let loading = null;

    if (this.state.error) {
      error = (<Alert variant={"danger"}>Invalid e-mail and password combination.</Alert>);
    }

    if (this.state.loading) {
      loading = (<div className="loader">
        <FontAwesomeIcon icon={faSpinner} spin={true} />
      </div>);
    }

    return (<div className={"container__signin"}>
      <h1 className={"display_1"}>Sign in</h1>
      {loading}
      {error}
      <Form className={"container__signin_form"} autoComplete={"false"} onSubmit={this.sendLoginRequest.bind(this)}>
        <Form.Group controlId="email">
          <Form.Label>E-mail address</Form.Label>
          <Form.Control type="email" placeholder="E-mail address" onChange={ (e) => this.setState({ username: e.target.value }) } />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Your password</Form.Label>
          <Form.Control type="password" placeholder="Your password" onChange={ (e) => this.setState({ password: e.target.value }) }/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
        <div className="info__register">
          You can also register a new account by <a href="#accounts/new/">clicking here</a>.
        </div>
      </Form>
    </div>);
  }
}

export default Login;
