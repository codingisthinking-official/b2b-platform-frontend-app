import React, { Component } from "react";
import { Button, Alert, Table, Modal, Form } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import config from "../../config";
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
//     fetch(config.api_url + '/api/account/import/', {
//         method: 'POST',
//         body: formData
//       }).then(res => {
//         if (res.ok) {
//         } else {
//         }
//       });

    this.setState({
      'fileUploaded': true
    });

    this.setShow(false);
  }

  render() {
    let products = (<Alert variant={"primary"}>No products added yet.</Alert>);

    if (this.state.products.length > 0) {
      const cols = this.state.products.map((p, i) => {
        return (<tr key={i}>
          <td>{p.id}</td>
          <td>{p.name}</td>
          <td>{p.ean}</td>
          <td>{p.location}</td>
          <td>
            <Button variant={"danger"} size={"sm"} onClick={(e) => {
              this.removeProduct(p);
              e.preventDefault();
              e.stopPropagation();
            }}>
              <FontAwesomeIcon icon={ faTrash } /> Remove
            </Button>
          </td>
        </tr>)
      });

      products = (<Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>EAN</th>
            <th>Location</th>
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
        Your Excel file is being parsed. It may take a while until finished.
      </Alert>)
    }

    const handleClose = () => this.setShow(false);
    return (
      <div className={"box-white"}>
        {fileUploadedAlert}
        <h1>Manage products</h1>
        <h2>Add new product</h2>
        Currently, it is not possible to add a new product using the form on the page.
        <br/>
        However, you can use the import system using <strong>the prepared Excel file</strong>.
        <br/>
        <br/>
        <Button variant={"secondary"} href={"/vendors/sample-import.xlsx"}>Download example CSV import file</Button>
        <br/>
        <br/>
        <Button onClick={(e) => {
          this.setState({
            'showModal': true
          });
        }}>Import products</Button>
        <h2>Your products</h2>
        {products}
        <Modal show={this.state.showModal} onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>Import products</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Please, drop your <strong>Excel file</strong> here
            so we can add your products to our database.
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
              Cancel
            </Button>
            <Button variant="primary" onClick={(e) => {
              const data = new FormData()
              data.append('file', this.state.selectedFile);

              this.sendFile(data);
              e.preventDefault();
              e.stopPropagation();
            }} disabled={this.state.selectedFile === ''}>
              Import
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ManageProductsContainer
