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
import NavMenuComponent from "./components/NavMenuComponent/NavMenuComponent";
import FooterComponent from "./components/FooterComponent/FooterComponent";
import LogoutComponent from "./components/LogoutComponent/LogoutComponent";

class App extends React.Component {
  render() {
    let context = null;
    let loggedRouter = null;

    if (!AuthenticationService.isAuthenticated()) {
      context = <Login />;
    } else {
      loggedRouter = (<Router>
        <Switch>
          <Route path="/about">
            about us
          </Route>
          <Route path="/users">
            users
          </Route>
          <Route path="/logout">
            <LogoutComponent/>
          </Route>
          <Route path="/">
            <NavMenuComponent/>
            list of all available products
            <FooterComponent/>
          </Route>
        </Switch>
      </Router>);
    }

    return (
      <div className="full-container">
        <Header center={!AuthenticationService.isAuthenticated()}/>
        <Container className={"container__main"}>
          {context}
          {loggedRouter}
        </Container>
      </div>
    );
  }
}

export default App;
