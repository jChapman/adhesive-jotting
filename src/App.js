import React, {Component} from 'react';
import './App.css';
import openSocket from 'socket.io-client'

import Pad from './Components/Pad'
import Jot from './Components/Jot'

const SERVER_URL = "http://localhost:8000"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jots: [],
      socket: openSocket(SERVER_URL)
    }
    this.state.socket.on('connected', () => {
      this.setState(() => ({jots: []}));
    })
    this.state.socket.on('new jot', jotData => {
      // Ignore new's if we already have that jot
      if (this.state.jots.filter((jot)=> jot.id === jotData.id).length > 0)
        return
      this.setState(({jots}) => ({jots: jots.concat([jotData])}));
    })
    this.state.socket.on('delete jot', jotData => {
      this.setState(({jots}) => ({ jots: jots.filter((jot) => jot.id !== jotData.id)}))
    })
    this.state.socket.on('show top', jotData => {
      this.setState(() => ({ showTop: true}))
    })
    this.state.socket.on('hide top', jotData => {
      this.setState(() => ({ showTop: false}))
    })
  }

  hideTop = () => {
      this.setState(() => ({ showTop: false }));
  }

  render() {
    return (
      <div className="App">
        <Pad socket={this.state.socket} />
        {this.state.jots.map(jotData => (
          <Jot key={jotData.id} socket={this.state.socket} {...jotData} />
        ))}
        <div className="topJots" style={{ display: this.state.showTop ? "block" : "none" }} >
          <button id="close-button" onClick={this.hideTop}>
            X
          </button>
          <table className="jotsTable">
            {[...this.state.jots]
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 5)
              .map(jotData => (
                <tr key={jotData.id}>
                  <td>{jotData.votes}</td>
                  <td>{jotData.text}</td>
                </tr>
              ))}
          </table>
        </div>
      </div>
    );
  }
}

export default App;
