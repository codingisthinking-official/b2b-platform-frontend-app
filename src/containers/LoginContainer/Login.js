import React, { Component } from "react";

import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLock, faSpinner} from '@fortawesome/free-solid-svg-icons'
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

    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    let error = null;
    let loading = null;

    if (this.state.error) {
      error = (<Alert variant={"danger"}>Niepoprawny e-mail lub hasło.</Alert>);
    }

    if (this.state.loading) {
      loading = (<div className="loader">
        <FontAwesomeIcon icon={faSpinner} spin={true} />
      </div>);
    }

    return (<div className={"container container__signin"}>
      <h1 className={"display_1"}>Zaloguj się</h1>
      {loading}
      {error}
      <Form className={"container__signin_form"} autoComplete={"false"} onSubmit={this.sendLoginRequest.bind(this)}>
        <Form.Group controlId="email">
          <Form.Label>Adres e-mail</Form.Label>
          <Form.Control type="email" placeholder="Adres e-mail" onChange={ (e) => this.setState({ username: e.target.value }) } />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Hasło</Form.Label>
          <Form.Control type="password" placeholder="Hasło" onChange={ (e) => this.setState({ password: e.target.value }) }/>
        </Form.Group>
        <Button variant="info" type="submit">
          <FontAwesomeIcon icon={ faLock } /> zaloguj się
        </Button>
        {/*<div className="info__register">*/}
        {/*  If you don't have account yet, you can register a new one by <a href="/register/" onClick={(e)=> {*/}
        {/*    alert('Not implemented yet.');*/}
        {/*    e.preventDefault();*/}
        {/*    e.stopPropagation();*/}
        {/*}}>clicking here</a>.*/}
        {/*</div>*/}
      </Form>
    </div>);
  }
}

export default Login;
