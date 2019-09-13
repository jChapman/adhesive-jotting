import React, {Component} from 'react';
import Draggable from 'react-draggable';
import './App.css';
import openSocket from 'socket.io-client'

import Pad from './Components/Pad'
import Jot from './Components/Jot'


let id = 0;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jots: []
    }
  }
  handleCreateJot = (jotData) => {
    this.setState(oldState => ({
      jots: oldState.jots.concat([
        { id: id++, color: jotData.color, text: jotData.text }
      ])
    }));
  }

  render() {
    return (
      <div className="App">
        <Pad handleCreateJot={this.handleCreateJot} />
        {this.state.jots.map(jotData => (
          <Jot
            key={jotData.id}
            color={jotData.color}
            text={jotData.text}
          />
        ))}
      </div>
    );
  }
}

class OldJot extends Component {
  constructor(props) {
    super(props);
    this.positionUpdate = this.positionUpdate.bind(this);
    this.state = {
      id: props.jotData.id,
      text: props.jotData.text,
      color: props.jotData.color,
      position: props.position,
      positionUpdate: props.positionUpdate,
      socket: props.socket
    }
    this.handleDelete = this.handleDelete.bind(this);

    props.socket.on("jot moved", moveData => {
      if (moveData.id === this.state.id) {
        this.setState({position: moveData.position})
      }
    });
  }
  positionUpdate(e, position) {
    this.state.positionUpdate(e, position);
    let {x, y}  = position
    this.setState({
      position: { x, y }
    });
  }

  handleDelete() {
    this.props.socket.emit('delete jot', {id: this.state.id});
  }

  render() {
    return (
      <Draggable onStop={this.positionUpdate} position={this.state.position}>
        <div
          id={this.state.id}
          className="box"
          style={{ background: this.state.color }}
        >
          <div style={{textAlign: 'right', paddingRight: '5px'}} onClick={this.handleDelete}>X</div>
          <p>{this.state.text}</p>
        </div>
      </Draggable>
    );
  }
}

const JotContainer = props => (
  <div className="jot-container">
    {props.jots.map((jotData) => (
      <Jot key={jotData.id} jotData={jotData} positionUpdate={props.positionUpdate} position={jotData.position} socket={props.socket}/>
    ))}
  </div>
)


class OldApp extends Component {
  constructor(props) {
    super(props);
    this.handleCreateJot = this.handleCreateJot.bind(this);
    this.handleUpdatePosition = this.handleUpdatePosition.bind(this);
    this.handleDeleteAll = this.handleDeleteAll.bind(this);
    this.state = {
      jots: props.jots,
      socket: openSocket("http://localhost:8000")
    }
    this.state.socket.on('new jot', jotData => {
      this.setState((oldState) => ({
        jots: oldState.jots.concat([jotData])
      }))
    });
    this.state.socket.on('delete jot', jotData => {
      this.setState((oldState) => ({
        jots: oldState.jots.filter((jot) => {
          return jot.id !== jotData.id;
        })
      }))
    });
  }

  handleCreateJot(jotData) {
    this.state.socket.emit('new jot', jotData);
  }

  handleUpdatePosition(e, position) {
    const {x, y} = position;
    let draggableElement = undefined;
    for (let element of e.path) {
      if (element.classList.contains('react-draggable')) {
        draggableElement = element;
        break;
      }
    }
    if (!draggableElement)
      return;
    this.state.socket.emit('jot moved', {id: parseInt(draggableElement.id), position: {x, y}});
  }

  handleDeleteAll() {
    this.state.socket.emit('delete all');
  }

  /*
  render() {
    return (
      <div className="App">
        //<JotMaker handleCreateJot={this.handleCreateJot}/>
        <button onClick={this.handleDeleteAll}>Delete All</button>
        <JotContainer jots={this.state.jots} positionUpdate={this.handleUpdatePosition} socket={this.state.socket}/>
      </div>
    );
  }
  */
}

OldApp.defaultProps = {
  jots: []
}

export default App;
