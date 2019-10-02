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
    this.state.socket.on('new jot', jotData => {
      this.setState(({jots}) => ({jots: jots.concat([jotData])}));
    })
    this.state.socket.on('delete jot', jotData => {
      this.setState(({jots}) => ({ jots: jots.filter((jot) => jot.id !== jotData.id)}))
    })
  }

  render() {
    return (
      <div className="App">
        <Pad handleCreateJot={this.handleCreateJot} socket={this.state.socket}/>
        {this.state.jots.map(jotData => (
          <Jot
            key={jotData.id}
            socket={this.state.socket}
            {...jotData}
          />
        ))}
      </div>
    );
  }
}

export default App;
