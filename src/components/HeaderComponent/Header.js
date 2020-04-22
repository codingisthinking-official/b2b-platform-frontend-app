import React, { Component } from "react";
import logo from "./logo.svg";
import './Header.css';

class Header extends Component {
  render() {
    return (
      <header style={{'textAlign': (this.props.center ? 'center' : '')}}>
        <img src={logo} alt={"B2B CodingIsThinking"} />
      </header>
    );
  }
}

export default Header
