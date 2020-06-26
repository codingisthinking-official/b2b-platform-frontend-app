import React, { Component } from "react";
import { Button, Alert, Table, Modal, Form } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faIndent } from '@fortawesome/free-solid-svg-icons'

import config from "../../config";
import SidebarContainer from "../SidebarContainer/SidebarContainer";
import AuthenticationService from "../../services/AuthenticationService";

import "./ManageProductsContainer.css";

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
    let products = (<Alert variant={"primary"}>No products added yet.</Alert>);

    if (this.state.products.length > 0) {
      const cols = this.state.products.map((p, i) => {
        let url = '/manage/products/' + p.id + '/edit/';
        return (<tr key={i}>
          <td>{p.id}</td>
          <td>
            <strong>{p.name}</strong>
            <br/>
            €{p.price.toFixed(2)}
            <br/>
            Location: {p.location}
          </td>
          <td>
            <Button href={url} className={"button-edit"} variant={"primary"} size={"sm"}>
              <FontAwesomeIcon icon={ faIndent } /> edit
            </Button>
            <Button variant={"danger"} size={"sm"} onClick={(e) => {
              this.removeProduct(p);
              e.preventDefault();
              e.stopPropagation();
            }}>
              <FontAwesomeIcon icon={ faTrash } /> remove
            </Button>
          </td>
        </tr>)
      });

      products = (<Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Product name</th>
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
        Your file is being processed. It may take a while.
      </Alert>)
    }

    const handleClose = () => this.setShow(false);
    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <div className={"box-white"}>
          <h1>Manage products</h1>
          {fileUploadedAlert}
          <h2>Add new product</h2>
          <strong>Download the example Excel file</strong>,
          then attach your new products to the file and upload it back
          so we can add your products to the platform.
          <br/>
          <br/>
          <Button variant={"secondary"} href={"/vendors/sample-import.xlsx"}>Download the Excel template file</Button>
          <br/>
          <br/>
          <Button onClick={(e) => {
            this.setState({
              'showModal': true
            });
          }} variant={"info"}>Import products</Button>
          <h2>Your stock</h2>
          <Button variant={"primary"} href="/manage/products/new/">
            Add new product
          </Button>
          <br/><br/>
          {products}
          <Modal show={this.state.showModal} onHide={handleClose} animation={true}>
            <Modal.Header closeButton>
              <Modal.Title>Import products</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <strong>Drop your Excel file here</strong> so we can process it immediately and add them to the platform.
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
                Start import
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

export default ManageProductsContainer
