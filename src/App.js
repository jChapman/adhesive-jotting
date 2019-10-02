import React, {Component} from 'react';
import './App.css';
//import openSocket from 'socket.io-client'

import Pad from './Components/Pad'
import Jot from './Components/Jot'


let id = 0;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jots: [{id: id++, text: 'blah', color: 'rgb(254, 243, 189)', position: {x: 500, y: 30}}]
    }
  }
  handleCreateJot = (jotData) => {
    this.setState(oldState => ({
      jots: oldState.jots.concat([
        { id: id++, color: jotData.color, text: jotData.text }
      ])
    }));
  }

  handleDeleteJot = (jotId) => {
    this.setState(oldState => ({
      jots: oldState.jots.filter((jot) => jot.id !== jotId)
    }))
  }

  render() {
    return (
      <div className="App">
        <Pad handleCreateJot={this.handleCreateJot} />
        {this.state.jots.map(jotData => (
          <Jot
            key={jotData.id}
            handleDelete={this.handleDeleteJot}
            {...jotData}
          />
        ))}
      </div>
    );
  }
}

export default App;
