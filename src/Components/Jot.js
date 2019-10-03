import React, {Component} from 'react';
import Draggable from 'react-draggable';

class Jot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: props.position,
      votes: props.votes,
    }
    this.props.socket.on('jot moved', jotData => {
      if (jotData.id === this.props.id) {
        this.setState(()=> ({position: jotData.position}))
      }
    })
    this.props.socket.on('updateVotes', voteData => {
      if (voteData.id === this.props.id) {
        this.setState(()=> ({votes: voteData.votes}))
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
      votes: this.props.votes
    });
  };

  handleDelete = () => {
    this.props.socket.emit('delete jot', {id: this.props.id});
  };
  voteUp = () => {
    this.props.socket.emit('updateVotes', {id: this.props.id, votes: this.state.votes+1});
  };

  render() {
    return (
      <Draggable
        onStop={this.positionUpdate}
        position={this.state.position}
        onStart={this.dragStarted}
      >
        <div
          id={this.props.id}
          className="box"
          style={{ background: this.props.color }}
        >
          <button id="close-button" onClick={this.handleDelete}>
            X
          </button>
          <div class="vote-button-holder">
            <span onClick={this.voteUp} className="vote-up" role="img" aria-label="vote up">
              👍
            </span>
          </div>
          <p className="jot-text">{this.props.text}</p>
          <div className="vote-holder">
            {[...Array(this.state.votes)].map((e, i) => (
              <span className="vote" key={i}></span>
            ))}
          </div>
        </div>
      </Draggable>
    );
  }
}

export default Jot;