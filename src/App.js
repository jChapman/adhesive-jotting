import React, {Component} from 'react';
import Draggable from 'react-draggable';
import './App.css';
import openSocket from 'socket.io-client'

class JotMaker extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    const text = e.target.elements.jotText.value.trim();
    const color = e.target.elements.jotText.value.trim();
    this.props.handleCreateJot({text, color});
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onFormSubmit} className="new-form">
          <input className="form-input" type="text" name="jotText" />
          <button className="form-button" type="submit">
            Jot
          </button>
        </form>
      </div>
    );
  }
}
const Jot = props => (
  <Draggable class="jot">
    <div className="box">
      <p>{props.text}</p>
    </div>
  </Draggable>
);

const JotContainer = props => (
  <div className="jot-container">
    {props.jots.map((jotData) => (
      <Jot key={jotData.key} text={jotData.text}/>
    ))}
  </div>
)


class App extends Component {
  constructor(props) {
    super(props);
    this.handleCreateJot = this.handleCreateJot.bind(this);
    this.state = {
      jots: props.jots,
      socket: openSocket("http://localhost:8000")
    }
    this.state.socket.on('new jot', jotText => {
      console.log("new jot");
      this.setState((oldState) => ({
        jots: oldState.jots.concat([jotText])
      }))
    });
  }

  handleCreateJot(jotData) {
    console.log('Emitting new jot')
    this.state.socket.emit('new jot', jotData);
  }

  render() {
    return (
      <div className="App">
        <JotMaker handleCreateJot={this.handleCreateJot}/>
        <JotContainer jots={this.state.jots}/>
      </div>
    );
  }
}

App.defaultProps = {
  jots: []
}

export default App;
