import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Container from "react-bootstrap/Container";

import Header from "./components/HeaderComponent/Header";
import AuthenticationService from "./services/AuthenticationService";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import NavMenuComponent from "./components/NavMenuComponent/NavMenuComponent";
import FooterComponent from "./components/FooterComponent/FooterComponent";
import HomepageContainer
  from "./containers/HomepageContainer/HomepageContainer";
import LogoutContainer from "./containers/LogoutContainer/LogoutContainer";
import Login from "./containers/LoginContainer/Login";

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
            <LogoutContainer/>
          </Route>
          <Route path="/">
            <NavMenuComponent/>
            <HomepageContainer />
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
