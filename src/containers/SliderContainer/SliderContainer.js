import React, { Component } from "react";
import SliderComponent from "../../components/SliderComponent/SliderComponent";

import image from "./banner.svg";

class SliderContainer extends Component {
  render() {
    return <SliderComponent images={[image]}/>
  }
}

export default SliderContainer;
