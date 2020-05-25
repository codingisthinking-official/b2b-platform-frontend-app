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
import Login from "./containers/LoginContainer/Login";
import ProductContainer from "./containers/ProductContainer/ProductContainer";
import config from "./config";
import SearchContainer from "./containers/SearchContainer/SearchContainer";
import ManageProductsContainer from "./containers/ManageProductsContainer/ManageProductsContainer";
import SubAccountsContainer
  from "./containers/SubAccountsContainer/SubAccountsContainer";

class App extends React.Component {
  render() {
    let context = null;
    let loggedRouter = null;

    if (!AuthenticationService.isAuthenticated()) {
      context = <Login />;
    } else {
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
            if (!resp.ok) {
              AuthenticationService.logout();
              window.location.href = '/';
            }
          });
        });

      loggedRouter = (<Router>
        <Switch>
          <Route path="/manage/products/">
            <NavMenuComponent/>
            <ManageProductsContainer />
            <FooterComponent/>
          </Route>
          <Route path="/manage/subaccounts/">
            <NavMenuComponent/>
            <SubAccountsContainer />
            <FooterComponent/>
          </Route>
          <Route path="/products/search/:q/">
            <NavMenuComponent/>
            <SearchContainer />
            <FooterComponent/>
          </Route>
          <Route path="/product/:productId/">
            <NavMenuComponent/>
            <ProductContainer />
            <FooterComponent/>
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
        <Header />
        <Container className={"container__main"}>
          {context}
          {loggedRouter}
        </Container>
      </div>
    );
  }
}

export default App;
