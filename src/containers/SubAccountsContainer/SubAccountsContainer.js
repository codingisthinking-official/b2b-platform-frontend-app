import React, { Component } from "react";
import config from "../../config";
import { withRouter } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import { Table, Form, Alert, Button, Modal } from "react-bootstrap";

import AuthenticationService from "../../services/AuthenticationService";

import SidebarContainer from "../SidebarContainer/SidebarContainer";

class SubAccountsContainer extends Component {
  constructor() {
    super();
    this.state = {
      'subAccounts': null,
      'showModal': false,
      'name': '',
      'email': '',
      'password': '',
      'errors': [],
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
        res.json().then((r) => {
          console.log(r);
          this.setState({'errors': r});
        });
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
          <th>Konto</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {subAccountRows}
        </tbody>
      </Table>);
    } else {
      subAccounts = <Alert variant={"primary"}>Nie dodałes jeszcze kont.</Alert>
    }

    let alerts = null;

    if (this.state.errors && this.state.errors.length > 0) {
      alerts = this.state.errors.map((e,i) => {
        return (<Alert variant={"danger"} key={i}>{e.message}</Alert>);
      });
    }

    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <div className={"box-white"}>
          <h1 className={"product--container-heading"}>Zarządzaj kontami klientów</h1>
          {subAccounts}
          <Button variant={"info"} onClick={this.openAccountForm.bind(this)}>
            Dodaj konto
          </Button>
          <Modal show={this.state.showModal} onHide={handleClose} animation={true}>
            <Modal.Header closeButton>
              <Modal.Title>Dodawanie nowego konta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Proszę, imię, adres e-mail oraz poczatkowe hasło
              abyśmy mogli stworzyć konto dla Twojego partnera.
              <br/><br/>
              {alerts}
              <Form>
                <Form.Group controlId="name">
                  <Form.Label>Imię i nazwisko</Form.Label>
                  <Form.Control onChange={(event) => {
                    this.setState({'name': event.target.value})
                  }} />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control onChange={(event) => {
                    this.setState({'email': event.target.value})
                  }} />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Hasło</Form.Label>
                  <Form.Control onChange={(event) => {
                    this.setState({'password': event.target.value})
                  }} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer className={"modal__footer-line-light"}>
              <Button variant="secondary" onClick={handleClose}>
                Anuluj
              </Button>
              <Button variant="primary" onClick={(e) => {
                this.createNewAccount(
                  this.state.name, this.state.email, this.state.password
                );
                e.preventDefault();
                e.stopPropagation();
              }} disabled={this.state.selectedFile === ''}>
                Dodaj konto
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withRouter(SubAccountsContainer);
