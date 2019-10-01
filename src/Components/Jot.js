import React, {Component} from 'react';
import Draggable from 'react-draggable';

class Jot extends Component {
  constructor(props) {
    super(props);
    console.log("Created Jot");
  }

  positionUpdate = (e, position) => {
    /*
    this.state.positionUpdate(e, position);
    let {x, y}  = position
    this.setState({
      position: { x, y }
    });
    */
  };

  handleDelete = () => {
    //this.props.socket.emit('delete jot', {id: this.state.id});
    this.props.handleDelete(this.props.id)
  };

  render() {
    return (
      <Draggable onStop={this.positionUpdate} position={this.props.position}>
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