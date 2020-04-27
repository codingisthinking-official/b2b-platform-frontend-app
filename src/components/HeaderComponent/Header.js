import React, { Component } from "react";
import logo from "./logo.png";
import './Header.css';

class Header extends Component {
  render() {
    return (
      <div className="container-header">
        <header className={"container"} style={{'textAlign': (this.props.center ? 'center' : '')}}>
          <a href={"/"} title="Homepage">
            <img src={logo} alt={"B2B CodingIsThinking"} />
          </a>
        </header>
      </div>
    );
  }
}

export default Header
