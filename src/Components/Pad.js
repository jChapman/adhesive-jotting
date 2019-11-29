import React, {useState} from 'react';
import {GithubPicker} from 'react-color'

const COLORS = [
  "#EB9694",
  "#FAD0C3",
  "#FEF3BD",
  "#C1E1C5",
  "#BEDADC",
  "#C4DEF6",
  "#BED3F3",
  "#D4C4FB"
];

const Pad = props => {
  const [displayColorPicker, changeDisplayColorPicker] = useState(false)
  const [color, setColor] = useState("rgb(254, 243, 189)")

  const onFormSubmit = e => {
    e.preventDefault();
    const text = e.target.elements.jotText.value.trim();
    e.target.elements.jotText.value = "";
    props.socket.emit("new jot", {
      text,
      color,
      position: { x: 0, y: 0 },
      votes: 0
    });
  };

  const handleColorClick = () => {
    changeDisplayColorPicker(oldState => !oldState)
  };

  const handleCloseColorPicker = () => {
    changeDisplayColorPicker(false)
  };

  const handleColorChange = color => {
    setColor(color.hex)
  };

  const handleColorSelect = color => {
    setColor(color.hex)
    changeDisplayColorPicker(false)
  };

  // TODO: This is bad
  return (
    <>
      <div
        className="box"
        style={{
          transform: "translate(9px, 9px)",
          background: color
        }}
      ></div>
      <div
        className="box"
        style={{
          transform: "translate(6px, 6px)",
          background: color
        }}
      ></div>
      <div
        className="box"
        style={{
          transform: "translate(3px, 3px)",
          background: color
        }}
      ></div>
      <div className="box" style={{ background: color }}>
      <div className="colorpicker">
        <img
          src="colorpal.svg"
          alt="select color"
          onClick={handleColorClick}
        />
        {displayColorPicker && (
          <div className="popover">
            <GithubPicker
              colors={COLORS}
              onChange={handleColorSelect}
              onSwatchHover={handleColorChange}
            />
            <div
              className="cover"
              onClick={handleCloseColorPicker}
              style={{ zIndex: -1 }}
            ></div>
          </div>
        )}
        </div>
        <form onSubmit={onFormSubmit} autoComplete="off" className="new-form">
          <input
            className="form-input"
            type="text"
            name="jotText"
            placeholder="Enter text here"
          />
          <button>Create</button>
        </form>
      </div>
    </>
  )
}

export default Pad;