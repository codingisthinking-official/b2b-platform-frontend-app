import React, { Component } from "react";

import { Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faSpinner, faUser
} from '@fortawesome/free-solid-svg-icons'

import config from "../../config";
import './RegisterContainer.css';

class RegisterContainer extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      type: 0,
      errors: null,
      created: false
    };
  }

  sendRegisterRequest(items, e) {
    this.setState({
      "loading": true,
      'errors': null
    });
    fetch(config.api_url + '/register/', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.ok) {
        res.json().then((e) => {
          this.setState({"created": e.created});
        });
        this.setState({"loading": false});
      } else {
        res.json().then((r) => {
          this.setState({
            errors: r
          });
        });
        this.setState({"loading": false});
      }
    });

    e.preventDefault();
    e.stopPropagation();
  }

  hasError(errors, key) {
    let hasErrors = false;

    if (!errors) {
      return false;
    }

    let error = errors.filter((e) => {
      return e.property_path === key;
    });

    if (error.length > 0) {
      hasErrors = true;
    }

    return hasErrors;
  }

  displayErrors(errors, key) {
    let errorContainer = null;

    if (!errors) {
      return null;
    }

    let error = errors.filter((e) => {
      return e.property_path === key;
    });

    if (error.length > 0) {
      return (<Form.Control.Feedback type="invalid">
        {error[0].message}
      </Form.Control.Feedback>);
    }

    return errorContainer;
  }

  render() {
    let error = null;
    let loading = null;

    if (this.state.loading) {
      loading = (<div className="loader">
        <FontAwesomeIcon icon={faSpinner} spin={true} />
      </div>);
    }

    if (this.state.created) {
      return (
        <div className={"container container__register"}>
          <h1 className={"display_1"}>Register a new account</h1>
          <Button href={"/"} variant={"outline-primary"} size={"sm"}>
            <FontAwesomeIcon icon={ faArrowLeft } /> Back to the login page
          </Button>
          <br/><br/>
          <Alert variant={"success"}>
            Your account has been successfully created. You can now sign in using your e-mail and password.
          </Alert>
        </div>
      );
    }

    return (<div className={"container container__register"}>
      <h1 className={"display_1"}>Register a new account</h1>
      <Button href={"/"} variant={"outline-primary"} size={"sm"}>
        <FontAwesomeIcon icon={ faArrowLeft } /> Back to the login page
      </Button>
      {loading}
      {error}
      <Form className={"container__register_form"} autoComplete={"off"} onSubmit={this.sendRegisterRequest.bind(this, this.state)}>
        <Form.Group controlId="firstName">
          <Form.Label>First name</Form.Label>
          <Form.Control type="text" isInvalid={this.hasError(this.state.errors, 'firstName')} placeholder="First name" autoComplete={"off"} onChange={ (e) => this.setState({ first_name: e.target.value }) } />
          {this.displayErrors(this.state.errors, 'firstName')}
        </Form.Group><Form.Group controlId="email">
        <Form.Label>Last name</Form.Label>
        <Form.Control type="text" isInvalid={this.hasError(this.state.errors, 'lastName')} placeholder="Last name" autoComplete={"off"} onChange={ (e) => this.setState({ last_name: e.target.value }) } />
        {this.displayErrors(this.state.errors, 'lastName')}
      </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>E-mail address</Form.Label>
          <Form.Control type="email" isInvalid={this.hasError(this.state.errors, 'email')} placeholder="E-mail address" autoComplete={"off"} onChange={ (e) => this.setState({ email: e.target.value }) } />
          {this.displayErrors(this.state.errors, 'email')}
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control isInvalid={this.hasError(this.state.errors, 'password')} type="password" placeholder="Password" autoComplete={"off"} onChange={ (e) => this.setState({ password: e.target.value }) }/>
          {this.displayErrors(this.state.errors, 'password')}
        </Form.Group>
        {/*<Form.Group controlId="type">*/}
        {/*  <Form.Label>Who would you like to be on the platform</Form.Label>*/}
        {/*  <div>*/}
        {/*    <Form.Check*/}
        {/*      type={"radio"}*/}
        {/*      label={`I want to buy stock in the marketplace`}*/}
        {/*      checked={this.state.type === 0}*/}
        {/*      onClick={() => {*/}
        {/*        this.setState({*/}
        {/*          type: 0*/}
        {/*        });*/}
        {/*      }}*/}
        {/*    />*/}
        {/*    <Form.Check*/}
        {/*      type={"radio"}*/}
        {/*      label={`I want to sell products in the marketplace`}*/}
        {/*      checked={this.state.type === 1}*/}
        {/*      onClick={() => {*/}
        {/*        this.setState({*/}
        {/*          type: 1*/}
        {/*        });*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</Form.Group>*/}
        <Button variant="primary" type="submit">
          <FontAwesomeIcon icon={ faUser } /> Register a new account
        </Button>
      </Form>
    </div>);
  }
}

export default RegisterContainer;
