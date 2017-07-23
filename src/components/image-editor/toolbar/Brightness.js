import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Slider from "react-rangeslider";

const BrightnessContainer = styled.div`
  padding: 16px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  .sliderContent {
    width: 500px;
    .rangeslider__handle{
      width: 20px;
      height: 20px;
      box-shadow: none;
      top: -6px;
      :after{
        width: 11px;
		    height: 11px;
		    top: 4px;
		    left: 4px;
		    background-color: #3498db;
		    box-shadow: none;
      }
    }
  }
  .sliderLabel{
    position: relative;
    label {
      color: #ffffff;
      font-size: 10px;
      font-weight: 600;
      position: relative;
      margin-bottom: 5px;
    }
  }
  .rangeslider{
    margin: 0px 0px;
  }
`;

const Clearfix = styled.div`
  height: 16px;
`;

export default class Brightness extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func
  };

  state = {
    brightness: 100,
    contrast: 100
  };

  getPercent(percent) {
    return (percent - 100) / 100;
  }

  handleChangeSlider(key, value) {
    this.setState(
      {
        [key]: value
      },
      this.handleChangeComplete
    );
  }

  handleChangeComplete() {
    if (this.props.onChange) {
      this.props.onChange({
        brightness: this.getPercent(this.state.brightness),
        contrast: this.getPercent(this.state.contrast)
      });
    }
    return;
  }

  renderSlider(label, key) {
    return (
      <div className="sliderLabel">
        <label>{label}</label>
        <Slider
          min={0}
          max={200}
          value={this.state[key]}
          tooltip={false}
          onChange={this.handleChangeSlider.bind(this, key)}
        />
      </div>
    );
  }

  render() {
    return (
      <BrightnessContainer>
        <div className="sliderContent">
          {this.renderSlider("Độ sáng", "brightness")}
          {this.renderSlider("Tương phản", "contrast")}
        </div>
      </BrightnessContainer>
    );
  }
}