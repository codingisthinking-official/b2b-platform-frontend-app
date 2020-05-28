import React, { Component } from "react";

import { Container } from "react-bootstrap";

import './SliderComponent.css';

class SliderComponent extends Component {
  render() {
    if (!this.props.images) {
      return null;
    }

    let images = this.props.images.map((img, index) => {
      return (<img src={img} alt={"Slider" + index} key={index} />);
    });

    return (
      <div className={"container-slider"}>
        <Container>
          {images}
        </Container>
      </div>
    );
  }
}

export default SliderComponent;
