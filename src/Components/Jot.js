import React, {Component} from 'react';
import Draggable from 'react-draggable';

class Jot extends Component {
  constructor(props) {
    super(props);
    console.log('Created Jot')
  }

  positionUpdate = (e, position) => {
    /*
    this.state.positionUpdate(e, position);
    let {x, y}  = position
    this.setState({
      position: { x, y }
    });
    */
  }

  handleDelete = () => {
    //this.props.socket.emit('delete jot', {id: this.state.id});
  }

  render() {
    return (
      <Draggable onStop={this.positionUpdate} position={this.props.position}>
        <div
          id={this.props.id}
          className="box"
          style={{ background: this.props.color }}
        >
          <p>{this.props.text}</p>
        </div>
      </Draggable>
    );
  }
}

export default Jot