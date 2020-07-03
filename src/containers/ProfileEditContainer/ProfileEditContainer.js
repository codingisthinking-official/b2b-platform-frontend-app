import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import { Button, Modal, Alert, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import AuthenticationService from "../../services/AuthenticationService";
import config from "../../config";
import stripeLogo from "./stripe-logo.png";

import "./ProfileEditContainer.css";

class ProfileEditContainer extends Component {
  constructor() {
    super();
    this.state = {
      errors: [],
      changed: false,
      showModal: false,
      cards: [],
      invoice: {
        name: "",
        vat: "",
        city: "",
        zip_code: "",
        street: ""
      },
      personal: {
        email: "",
        name: "",
      },
      card: {
        number: '',
        cvc: '',
        exp_month: '',
        exp_year: ''
      },
      creditCardError: false
    };
  }

  componentDidMount() {
    if (AuthenticationService.getUser()) {
      this.setState({
        personal: {
          email: AuthenticationService.getUser().email,
          name: AuthenticationService.getUser().name
        }
      });

      if (AuthenticationService.getUser()) {
        const user = AuthenticationService.getUser();
        this.setState({
          invoice: {
            name: user.invoice_company_name,
            vat: user.invoice_vat,
            city: user.invoice_city,
            zip_code: user.invoice_zip_code,
            street: user.invoice_street
          }
        });

        this.refreshCreditCards();
      }
    }
  }

  refreshCreditCards() {
    fetch(config.api_url + '/api/payment/credit_cards/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    }).then(r => {
      r.json().then(r => {
        this.setState({"cards": r});
      });
    });
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

  savePersonalDetails() {
    let requestData = {
      name: this.state.personal.name,
      invoice_company_name: this.state.invoice.name,
      invoice_vat: this.state.invoice.vat,
      invoice_city: this.state.invoice.city,
      invoice_zip_code: this.state.invoice.zip_code,
      invoice_street: this.state.invoice.street,
    };
    const parent = this;

    if (AuthenticationService.getUser().email !== this.state.personal.email) {
      requestData.email = this.state.personal.email;
    }

    fetch(config.api_url + '/api/account/update/', {
      method: 'PUT',
      body: JSON.stringify(requestData),
      headers: {
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    }).then(res => {
      if (res.ok) {
        this.setState({
          changed: true,
          errors: []
        });

        const obj = {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
          }
        };
        fetch(config.api_url + '/api/account/current/', obj)
          .then(resp => {
            resp.json().then(r => {
              if (resp.ok) {
                AuthenticationService.setUser(r);
                parent.componentDidMount();
              }
            });
          });
      } else {
        res.json().then((r) => {
          this.setState({
            errors: r
          });
        });
      }
    });
  }

  updateCreditCardDetails(card)
  {
    fetch(config.api_url + '/api/payment/update_card/', {
      method: 'PUT',
      body: JSON.stringify(card),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    }).then(res => {
      if (res.ok) {
        this.refreshCreditCards();

        this.setState({"creditCardError": false});
        this.setShow(false);
      } else {
        this.setState({"creditCardError": true});
      }
    });
  }

  setShow(show) {
    this.setState({'showModal': show});
  }

  render() {
    let alert = null;
    let creditCardError = null;
    let creditCardData = null;

    if (this.state.changed) {
      alert = (<Alert variant={"success"}>Personal details have been changed and saved.</Alert> );
    }

    if (this.state.creditCardError) {
      creditCardError = (<Alert variant={"danger"}>Invalid credit card number, cvc or expire date.</Alert>);
    }

    if (this.state.cards.length > 0) {
      creditCardData = (<div className={"card--container"}>
        {this.state.cards.map((c, i) => {
          return (<div key={i}>
            <strong>Type</strong>: {c.brand}<br/>
            <strong>Ending:</strong> ****{c.last4}
          </div>);
        })}
      </div>)
    }

    const handleClose = () => this.setShow(false);
    let creditCardUpdateContainer = null;

    if (!AuthenticationService.isSupplier()) {
      creditCardUpdateContainer = <Col lg={6}>
        <h3>3. Your credit card</h3>
        <br/>
        Please, connect your credit card with our platform so we can
        charge your credit card against your orders.
        <br/><br/>

        {creditCardData}

        <Button onClick={(e) => {
          this.setShow(true);
          e.preventDefault();
          e.stopPropagation();
        }} variant={"primary"}>Update credit card</Button>
        <br/><br/>
        Payment provider:
        <img src={stripeLogo} alt={"Stripe payments"} className={"stripe-payment-logo"} style={{
          "height": "30px",
          "marginLeft": "20px",
          "position": "relative",
          "top": "-2px"
        }}/>
        <Modal show={this.state.showModal} onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>Update your credit card details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Your credit card details are stored in Stripe. <br/>
            <strong>We don't</strong> store your card number, cvc and expire date!
            <br/><br/>
            {creditCardError}
            <Form>
              <Form.Group controlId="number">
                <Form.Label>Card number</Form.Label>
                <Form.Control type="text" value={this.state.card.number} onChange={(e) => {
                  let card = this.state.card;
                  card.number = e.target.value;
                  this.setState({
                    'card': card
                  });
                }}/>
              </Form.Group>
              <Form.Group controlId="cvc">
                <Form.Label>CVC</Form.Label>
                <Form.Control type="text" value={this.state.card.cvc} onChange={(e) => {
                  let card = this.state.card;
                  card.cvc = e.target.value;
                  this.setState({
                    'card': card
                  });
                }}/>
              </Form.Group>
              <Form.Group controlId="expMonth">
                <Form.Label>Expire month</Form.Label>
                <Form.Control type="text" value={this.state.card.exp_month} onChange={(e) => {
                  let card = this.state.card;
                  card.exp_month = e.target.value;
                  this.setState({
                    'card': card
                  });
                }}/>
              </Form.Group>
              <Form.Group controlId="cvc">
                <Form.Label>Expire year</Form.Label>
                <Form.Control type="text" value={this.state.card.exp_year} onChange={(e) => {
                  let card = this.state.card;
                  card.exp_year = e.target.value;
                  this.setState({
                    'card': card
                  });
                }}/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className={"modal__footer-line-light"}>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={(e) => {
              this.updateCreditCardDetails(this.state.card);
              e.preventDefault();
              e.stopPropagation();
            }} disabled={this.state.selectedFile === ''}>
              Update credit card
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>;
    } else {
      creditCardUpdateContainer = <Col lg={6}>
        <h3>3. Your credit card</h3>
        <br/>
        No credit card is required to use the application.
      </Col>
    }

    return (<div className={"container--with-sidebar"}>
      <SidebarContainer />
      <div className={"box-white"}>
        <h1>Edit your profile</h1>
        {alert}
        <Row>
          <Col lg={6}>
            <Form>
              <h3>1. Personal details</h3>
              <br/>
              <Form.Group controlId="E-mail">
                <Form.Label>E-Mail</Form.Label>
                <Form.Control isInvalid={this.hasError(this.state.errors, 'email')} type="text" value={this.state.personal.email} onChange={(e) => {
                  let currentStateAddress = this.state.personal;
                  currentStateAddress.email = e.target.value;
                  this.setState({
                    personal: currentStateAddress
                  });
                }}/>
                {this.displayErrors(this.state.errors, 'delivery.address.name')}
              </Form.Group>
              <Form.Group controlId="firstName">
                <Form.Label>Your name</Form.Label>
                <Form.Control isInvalid={this.hasError(this.state.errors, 'name')} type="text" value={this.state.personal.name} onChange={(e) => {
                  let currentStateAddress = this.state.personal;
                  currentStateAddress.name = e.target.value;
                  this.setState({
                    personal: currentStateAddress
                  });
                }}/>
                {this.displayErrors(this.state.errors, 'delivery.address.name')}
              </Form.Group>
              <br/>
              <h3>2. Invoice Data</h3>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control isInvalid={this.hasError(this.state.errors, 'invoiceCompanyName')} type="text" value={this.state.invoice.name} onChange={(e) => {
                  let currentStateAddress = this.state.invoice;
                  currentStateAddress.name = e.target.value;
                  this.setState({
                    invoice: currentStateAddress
                  });
                }}/>
                {this.displayErrors(this.state.errors, 'invoiceCompanyName')}
              </Form.Group>
              <Form.Group controlId="vat">
                <Form.Label>VAT EU</Form.Label>
                <Form.Control isInvalid={this.hasError(this.state.errors, 'invoiceVat')} type="text" value={this.state.invoice.vat} onChange={(e) => {
                  let currentStateAddress = this.state.invoice;
                  currentStateAddress.vat = e.target.value;
                  this.setState({
                    invoice: currentStateAddress
                  });
                }}/>
                {this.displayErrors(this.state.errors, 'invoiceVat')}
              </Form.Group>
              <Form.Group controlId="zip">
                <Form.Label>Postal code</Form.Label>
                <Form.Control isInvalid={this.hasError(this.state.errors, 'invoiceZipCode')} type="text" value={this.state.invoice.zip_code} onChange={(e) => {
                  let currentStateAddress = this.state.invoice;
                  currentStateAddress.zip_code = e.target.value;
                  this.setState({
                    invoice: currentStateAddress
                  });
                }}/>
                {this.displayErrors(this.state.errors, 'invoiceZipCode')}
              </Form.Group>
              <Form.Group controlId="city">
                <Form.Label>City or town</Form.Label>
                <Form.Control isInvalid={this.hasError(this.state.errors, 'invoiceCity')} type="text" value={this.state.invoice.city} onChange={(e) => {
                  let currentStateAddress = this.state.invoice;
                  currentStateAddress.city = e.target.value;
                  this.setState({
                    invoice: currentStateAddress
                  });
                }}/>
                {this.displayErrors(this.state.errors, 'invoiceCity')}
              </Form.Group>
              <Form.Group controlId="street">
                <Form.Label>Street and number</Form.Label>
                <Form.Control isInvalid={this.hasError(this.state.errors, 'invoiceStreet')} type="text" value={this.state.invoice.street} onChange={(e) => {
                  let currentStateAddress = this.state.invoice;
                  currentStateAddress.street = e.target.value;
                  this.setState({
                    invoice: currentStateAddress
                  });
                }}/>
                {this.displayErrors(this.state.errors, 'invoiceStreet')}
              </Form.Group>
              <div className="text-right">
                <br/>
                <Button variant="info" type="submit" onClick={(e) => {
                  this.savePersonalDetails();
                  e.preventDefault();
                  e.stopPropagation();
                }}>
                  <FontAwesomeIcon icon={ faSave } /> &nbsp;save
                </Button>
              </div>
            </Form>
          </Col>
          {creditCardUpdateContainer}
        </Row>
      </div>
    </div>);
  }
}

export default withRouter(ProfileEditContainer);
