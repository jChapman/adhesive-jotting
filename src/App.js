import React, {Component} from 'react';
import Draggable from 'react-draggable';
import './App.css';
import openSocket from 'socket.io-client'

const  socket = openSocket('http://localhost:8000');

class JotMaker extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    const jotText = e.target.elements.jotText.value.trim();
    this.props.handleCreateJot(jotText);
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
    {props.jots.map((jot) => (
      <Jot key={jot} text={jot}/>
    ))}
  </div>
)


class App extends Component {
  constructor(props) {
    super(props);
    this.handleCreateJot = this.handleCreateJot.bind(this);
    this.state = {
      jots: props.jots
    }
  }

  handleCreateJot(jotText) {
    this.setState((oldState) => ({
      jots: oldState.jots.concat([jotText])
    }))
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
