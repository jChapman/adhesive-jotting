import React, {Component} from 'react';
import Draggable from 'react-draggable';
import './App.css';
import openSocket from 'socket.io-client'
import {GithubPicker} from 'react-color'

class JotMaker extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleColorClick = this.handleColorClick.bind(this);
    this.handleCloseColorPicker = this.handleCloseColorPicker.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.state = {
      displayColorPicker: false,
      color: 'rgb(254, 243, 189)'
    }
  }

  onFormSubmit(e) {
    e.preventDefault();
    const text = e.target.elements.jotText.value.trim();
    const color = this.state.color;
    const position = {x: 0, y:0}
    this.props.handleCreateJot({text, color, position});
  }

  handleColorClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleCloseColorPicker() {
    this.setState({ displayColorPicker: false })
  }

  handleColorChange(color) {
    this.setState({ color: color.hex})
  }

  render() {
    const colors = ['#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];
    return (
      <div>
        <form onSubmit={this.onFormSubmit} className="new-form">
          <input className="form-input" type="text" name="jotText" />
          <div className="swatch" onClick={this.handleColorClick}>
            <div className="swatch-color" style={{background: this.state.color}}></div>
          </div>
          {this.state.displayColorPicker && (
            <div className="popover">
              <div className="cover" onClick={this.handleCloseColorPicker}>
                <GithubPicker colors={colors} onChange={this.handleColorChange}/>
              </div>
            </div>
          )}
          <button className="form-button" type="submit">
            Jot
          </button>
        </form>
      </div>
    );
  }
}
class Jot extends Component {
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


class App extends Component {
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

  render() {
    return (
      <div className="App">
        <JotMaker handleCreateJot={this.handleCreateJot}/>
        <button onClick={this.handleDeleteAll}>Delete All</button>
        <JotContainer jots={this.state.jots} positionUpdate={this.handleUpdatePosition} socket={this.state.socket}/>
      </div>
    );
  }
}

App.defaultProps = {
  jots: []
}

export default App;
