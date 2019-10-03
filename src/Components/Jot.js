import React, {Component} from 'react';
import Draggable from 'react-draggable';

class Jot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: props.position,
    }
    this.props.socket.on('jot moved', jotData => {
      if (jotData.id === this.props.id) {
        this.setState(()=> ({position: jotData.position}))
      }
    })
  }

  dragStarted = () => {

  }

  positionUpdate = (e, position) => {
    this.props.socket.emit("jot moved", {
      position: { x: position.x, y: position.y },
      id: this.props.id,
      color: this.props.color,
      text: this.props.text,
    });
  };

  handleDelete = () => {
    this.props.socket.emit('delete jot', {id: this.props.id});
  };

  render() {
    return (
      <Draggable onStop={this.positionUpdate} position={this.state.position} onStart={this.dragStarted}>
        <div
          id={this.props.id}
          className="box"
          style={{ background: this.props.color }}
        >
          <div style={{ textAlign: "right"}}>
            <button id="close-button" onClick={this.handleDelete}>
              X
            </button>
          </div>
          <p className="jot-text">{this.props.text}</p>
        </div>
      </Draggable>
    );
  }
}

export default Jot;