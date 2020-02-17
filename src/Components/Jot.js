import React, {useState} from 'react';
import Draggable from 'react-draggable';

const Jot = (props) => {
  const [position, setPosition] = useState(props.position)
  const [votes, setVotes] = useState(props.votes)
  const [locked, setLocked] = useState(false)

  const socket = props.socket;
  const roomId = props.roomId;

  socket.on('jot moved', jotData => {
    console.log(`Jot moved ${jotData}`)
    if (jotData.id === props.id) {
      setPosition(jotData.position)
      setLocked(false)
    }
  })

  socket.on('updateVotes', voteData => {
    if (voteData.id === props.id) {
      setVotes(voteData.votes)
    }
  })

  socket.on('lock jot', ({id}) => {
    if (props.id === id) {
      setLocked(true)
    }
  })

  const dragStarted = () => {
    if (!locked) {
      socket.emit("lock jot", {id: props.id, roomId})
    }
  }

  const positionUpdate = (e, position) => {
    socket.emit("jot moved", {
      position: { x: position.x, y: position.y },
      id: props.id,
      color: props.color,
      text: props.text,
      votes,
      roomId
    });
  };

  const handleDelete = () => {
    socket.emit('delete jot', {id: props.id, roomId});
  };

  const voteUp = () => {
    socket.emit('updateVotes', {id: props.id, votes: votes+1, roomId});
  };

  return (
    <Draggable
      onStop={positionUpdate}
      position={position}
      onStart={dragStarted}
    >
      <div
        id={props.id}
        className="box"
        style={{ background: props.color, boxShadow: locked ? "0 0 10px 0px #00f3ff" : "none"}}
      >
        <button id="close-button" onClick={handleDelete}>
          X
        </button>
        <div className="vote-button-holder">
          <span onClick={voteUp} className="vote-up" role="img" aria-label="vote up">
            👍
          </span>
        </div>
        <p className="jot-text">{props.text}</p>
        <div className="vote-holder">
          {[...Array(votes)].map((e, i) => (
            <span className="vote" key={i}></span>
          ))}
        </div>
      </div>
    </Draggable>
  );
}

export default Jot;