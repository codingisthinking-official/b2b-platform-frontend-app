import React, { Component } from "react";
import config from "../../config";
import { withRouter } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import { Table, Form, Alert, Button, Modal } from "react-bootstrap";

import AuthenticationService from "../../services/AuthenticationService";

import "./SubAccountsContainer.css";

class SubAccountsContainer extends Component {
  constructor() {
    super();
    this.state = {
      'subAccounts': null,
      'showModal': false,
      'name': '',
      'email': '',
      'password': '',
    };
  }

  fetchAllSubAccounts() {
    const obj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    };
    fetch(config.api_url + '/api/subAccounts/', obj)
      .then(r => {
        r.json().then(r => {
          this.setState({
            'subAccounts': r,
          })
        });
      });
  }

  componentDidMount() {
    this.fetchAllSubAccounts();
  }

  setShow(show) {
    this.setState({
      'showModal': show,
      'name': '',
      'email': '',
      'password': ''
    });
  }

  openAccountForm() {
    this.setShow(true);
  }

  createNewAccount(name, email, password) {
    const requestData = {'name': name, 'email': email, 'password': password};
    fetch(config.api_url + '/api/subAccounts/new/', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    }).then(res => {
      if (res.ok) {
        this.fetchAllSubAccounts();
        this.setShow(false);
      } else {
      }
    });
  }

  removeSubaccount(subAccount) {
    const obj = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    };
    fetch(config.api_url + '/api/subAccounts/' + subAccount.id + '/delete/', obj)
      .then(r => {
        this.fetchAllSubAccounts();
      });
  }

  render() {
    const handleClose = () => this.setShow(false);
    let subAccounts = null;

    if (!this.state.subAccounts) {
      return null;
    }

    if (this.state.subAccounts.length > 0) {
      const subAccountRows = this.state.subAccounts.map((s, i) => {
        return (<tr key={i}>
          <td>
            <strong>{s.name}</strong>
            <br/>
            {s.email}
          </td>
          <td>
            <Button variant={"danger"} size={"sm"} onClick={(e) => {
              this.removeSubaccount(s);
              e.preventDefault();
              e.stopPropagation();
            }}>
              <FontAwesomeIcon icon={ faTrash } />
            </Button>
          </td>
        </tr>);
      });

      subAccounts = (<Table striped bordered hover>
        <thead>
        <tr>
          <th>Account</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {subAccountRows}
        </tbody>
      </Table>);
    } else {
      subAccounts = <Alert variant={"primary"}>No subaccounts added yet.</Alert>
    }

    return (
      <div>
        <div className={"box-white"}>
          <h1>Manage subaccounts</h1>
          {subAccounts}
          <Button variant={"primary"} onClick={this.openAccountForm.bind(this)}>
            Add a new subaccount
          </Button>
          <Modal show={this.state.showModal} onHide={handleClose} animation={true}>
            <Modal.Header closeButton>
              <Modal.Title>Add a new account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Please, enter a name, e-mail address and initial password
              so we can create a new sub-account.
              <br/><br/>
              <Form>
                <Form.Group controlId="name">
                  <Form.Label>Full name</Form.Label>
                  <Form.Control onChange={(event) => {
                    this.setState({'name': event.target.value})
                  }} />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>E-mail Address</Form.Label>
                  <Form.Control onChange={(event) => {
                    this.setState({'email': event.target.value})
                  }} />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control onChange={(event) => {
                    this.setState({'password': event.target.value})
                  }} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer className={"modal__footer-line-light"}>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={(e) => {
                this.createNewAccount(
                  this.state.name, this.state.email, this.state.password
                );
                e.preventDefault();
                e.stopPropagation();
              }} disabled={this.state.selectedFile === ''}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withRouter(SubAccountsContainer);
