import React, { Component } from "react";
import { Button, Alert, Table, Modal, Form } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import config from "../../config";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import AuthenticationService from "../../services/AuthenticationService";

class ManageProductsContainer extends Component {
  constructor() {
    super();
    this.state = {
      'products': [],
      'selectedFile': '',
      'fileUploaded': false,
    };
  }

  fetchProducts() {
    const obj = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
        }
      };
      fetch(config.api_url + '/api/account/products/', obj)
        .then(r => {
          r.json().then(r => {
            this.setState({
              'products': r,
            })
          });
        });
  }

  removeProduct(product) {
      const obj = {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
        }
      };
      fetch(config.api_url + '/api/product/' + product.id + '/remove/', obj)
        .then(r => {
          this.fetchProducts();
        });
  }

  componentDidMount() {
    this.fetchProducts();
  }

  setShow(show) {
    this.setState({'showModal': show});
  }

  sendFile(formData) {
    fetch(config.api_url + '/api/account/import/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
        }
      }).then(res => {
        if (res.ok) {
        } else {
        }
      });

    this.setState({
      'fileUploaded': true
    });

    this.setShow(false);
  }

  render() {
    let products = (<Alert variant={"primary"}>Nie dodano jeszcze produktów.</Alert>);

    if (this.state.products.length > 0) {
      const cols = this.state.products.map((p, i) => {
        return (<tr key={i}>
          <td>{p.id}</td>
          <td>
            <strong>{p.name}</strong>
            <br/>
            cena: {p.price.toFixed(2)} zł netto
            </td>
          <td>
            <Button variant={"danger"} size={"sm"} onClick={(e) => {
              this.removeProduct(p);
              e.preventDefault();
              e.stopPropagation();
            }}>
              <FontAwesomeIcon icon={ faTrash } />
            </Button>
          </td>
        </tr>)
      });

      products = (<Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nazwa produktu</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cols}
        </tbody>
      </Table>);
    }

    let fileUploadedAlert = null;

    if (this.state.fileUploaded) {
      fileUploadedAlert = (<Alert variant={"primary"}>
        Twój plik zostaje przetwarzany. Prosimy o chwilę cierpliwości.
      </Alert>)
    }

    const handleClose = () => this.setShow(false);
    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <div className={"box-white"}>
          {fileUploadedAlert}
          <h1>Zarządzanie listą produktów</h1>
          <h2>Dodaj nowy produkt</h2>
          <strong>Pobierz plik Excel</strong>, uzupełnij go według szablonu i wgraj go do platformy,
          aby dodać nowe produkty.
          <br/>
          <br/>
          <Button variant={"secondary"} href={"/vendors/sample-import.xlsx"}>Pobierz przykładowy szablon Excel</Button>
          <br/>
          <br/>
          <Button onClick={(e) => {
            this.setState({
              'showModal': true
            });
          }} variant={"info"}>Importuj produkty</Button>
          <h2>Wszystkie produkty</h2>
          {products}
          <Modal show={this.state.showModal} onHide={handleClose} animation={true}>
            <Modal.Header closeButton>
              <Modal.Title>Import produktów</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Proszę, <strong>upuść tutaj</strong> swój plik Excel, a my przetworzymy go na platformie i dodamy Twoje produkty do bazy.
              <br/><br/>
              <Form>
                <Form.Group controlId="upload">
                  <Form.Control type="file" onChange={(event) => {
                    this.setState({"selectedFile": event.target.files[0]})
                  }} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer className={"modal__footer-line-light"}>
              <Button variant="secondary" onClick={handleClose}>
                Anuluj
              </Button>
              <Button variant="primary" onClick={(e) => {
                const data = new FormData()
                data.append('file', this.state.selectedFile);

                this.sendFile(data);
                e.preventDefault();
                e.stopPropagation();
              }} disabled={this.state.selectedFile === ''}>
                Rozpocznij import
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

export default ManageProductsContainer
