import React, {Component} from 'react';
import {GithubPicker} from 'react-color'

class Pad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: "rgb(254, 243, 189)"
    };
  }

  onFormSubmit = e => {
    e.preventDefault();
    const text = e.target.elements.jotText.value.trim();
    console.log(text);
    e.target.elements.jotText.value = "";
    const color = this.state.color;
    this.props.handleCreateJot({ text, color });
  };

  handleColorClick = () => {
    this.setState(oldState => ({
      displayColorPicker: !oldState.displayColorPicker
    }));
  };

  handleCloseColorPicker = () => {
    this.setState(() => ({ displayColorPicker: false }));
  };

  handleColorChange = color => {
    this.setState({ color: color.hex });
  };

  handleColorSelect = color => {
    this.setState({ color: color.hex, displayColorPicker: false });
  };
  render = () => {
    const colors = [
      "#EB9694",
      "#FAD0C3",
      "#FEF3BD",
      "#C1E1C5",
      "#BEDADC",
      "#C4DEF6",
      "#BED3F3",
      "#D4C4FB"
    ];
    return (
      <div>
        <div
          className="box"
          style={{
            transform: "translate(9px, 9px)",
            background: this.state.color
          }}
        ></div>
        <div
          className="box"
          style={{
            transform: "translate(6px, 6px)",
            background: this.state.color
          }}
        ></div>
        <div
          className="box"
          style={{
            transform: "translate(3px, 3px)",
            background: this.state.color
          }}
        ></div>
        <div className="box" style={{ background: this.state.color }}>
        <div className="colorpicker">
          <img
            src="colorpal.svg"
            alt="select color"
            onClick={this.handleColorClick}
          />
          {this.state.displayColorPicker && (
            <div className="popover">
              <GithubPicker
                colors={colors}
                onChange={this.handleColorSelect}
                onSwatchHover={this.handleColorChange}
              />
              <div
                className="cover"
                onClick={this.handleCloseColorPicker}
                style={{ zIndex: -1 }}
              ></div>
            </div>
          )}
          </div>
          <form onSubmit={this.onFormSubmit} className="new-form">
            <input
              className="form-input"
              type="text"
              name="jotText"
              placeholder="Enter text here"
            />
            <button>Create</button>
          </form>
        </div>
      </div>
    );
  };
}

export default Pad;