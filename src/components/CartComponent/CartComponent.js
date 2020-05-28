import React, { Component } from "react";
import './CartComponent.css';
import SidebarContainer
  from "../../containers/SidebarContainer/SidebarContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faShoppingCart,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { Table, Button, Alert, Form, Row, Col } from "react-bootstrap";
import noPhotoImage from "../ProductListComponent/no-photo.svg";

class CartComponent extends Component {
  render() {
    if (!this.props.items) {
      return null;
    }

    let sum = 0;

    return (
      <div className={"container--with-sidebar container--cart"}>
        <SidebarContainer />
        <div className={"box-white"}>
          <h1 className={"product--container-heading"}>
            Koszyk
          </h1>
          <div className="limits">
            <FontAwesomeIcon icon={ faCreditCard } />  Twoja domyślna forma płatności: przelew, 5 dni. Przyznany limit kupiecki: 3 000,00 PLN
          </div>
          <Table>
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Ilość</th>
                <th>Cena</th>
                <th>Wartość netto</th>
              </tr>
            </thead>
            <tbody>
            {this.props.items.map((i, index) => {
              const photo = i.product.thumbnail ? i.product.thumbnail : noPhotoImage;
              sum += i.product.price * i.quantity;

              return (<tr key={index}>
                <td>
                  <img src={ photo } alt={i.product.name}/>
                  {i.product.name}
                </td>
                <td>{i.quantity}</td>
                <td>{i.product.price.toFixed(2)} zł</td>
                <td>
                  {(i.product.price * i.quantity).toFixed(2)} zł
                  <br/><br/>
                  <Button variant={"danger"} size={"sm"} onClick={(e) => {
                    this.props.parent.removeElementFromCart(i.product);
                    e.stopPropagation();
                    e.preventDefault();
                  }}>
                    <FontAwesomeIcon icon={ faTrash } /> usuń z koszyka
                  </Button>
                </td>
              </tr>);
            })}
            </tbody>
          </Table>
          <Alert variant={"info"}>
            Do zapłaty: {sum.toFixed(2)} zł netto
          </Alert>
          <Form>
            <Row className={"order-information"}>
              <Col lg={4}>
                <h3>Zamówienie</h3>
                <div>
                  <strong>Wartość netto</strong>: {sum.toFixed(2)} zł netto
                </div>
                <div>
                  <strong>Wartość brutto</strong>: {(sum * 1.23).toFixed(2)} zł netto
                </div>
                <br/>
                <div>
                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label><strong>Forma dostawy</strong></Form.Label>
                    <Form.Control as="select" custom>
                      <option>odbiór osobisty</option>
                      <option>kurier standard</option>
                      <option>kurier pobranie</option>
                    </Form.Control>
                  </Form.Group>
                </div>
                <div>
                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label><strong>Status</strong></Form.Label>
                    <Form.Control as="select" custom>
                      <option>do realizacji</option>
                      <option>rezerwacja</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              </Col>
              <Col lg={8}>
                <h3>Dane do wysyłki</h3>
                <Form.Group controlId="name">
                  <Form.Label>Imię i nazwisko</Form.Label>
                  <Form.Control type="text"/>
                </Form.Group>
                <Form.Group controlId="zip">
                  <Form.Label>Kod pocztowy</Form.Label>
                  <Form.Control type="text"/>
                </Form.Group>
                <Form.Group controlId="city">
                  <Form.Label>Miasto</Form.Label>
                  <Form.Control type="text"/>
                </Form.Group>
                <Form.Group controlId="street">
                  <Form.Label>Ulica i numer domu/mieszkania</Form.Label>
                  <Form.Control type="text"/>
                </Form.Group>
                <Form.Group controlId="country">
                  <Form.Label>Kraj</Form.Label>
                  <Form.Control type="text" value={"Polska"} readonly/>
                </Form.Group>
              </Col>
            </Row>
            <div className="text-right">
              <Button variant="info" type="submit" onClick={(e) => {
                alert('Wersja DEMO.');
                e.preventDefault();
                e.stopPropagation();
              }}>
                <FontAwesomeIcon icon={ faShoppingCart } /> złóż zamówienie
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default CartComponent
