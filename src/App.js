import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Container from "react-bootstrap/Container";

import Header from "./components/HeaderComponent/Header";
import Login from "./components/LoginComponent/Login";
import AuthenticationService from "./services/AuthenticationService";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


class App extends React.Component {
  render() {
    let context = null;
    if (!AuthenticationService.isAuthenticated()) {
      context = <Login />;
    }

    return (
      <Container className={"container__main"}>
        <Header center={!AuthenticationService.isAuthenticated()}/>
        {context}
      </Container>
    );
  }
}

export default App;
