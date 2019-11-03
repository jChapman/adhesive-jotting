import React, {Component} from 'react';
import './App.css';
import openSocket from 'socket.io-client'

import Pad from './Components/Pad'
import Jot from './Components/Jot'
import JotList from './Components/JotList'
import AdminPannel from './Components/AdminPannel'

const SERVER_URL = "http://localhost:8000"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jots: [],
      socket: openSocket(SERVER_URL),
      showList: false,
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
  }

  showList = () => {
    this.setState({showList: true})
  }

  hideList = () => {
    this.setState({showList: false})
  }

  render() {
    return (
      <div className="App">
        <AdminPannel showList={this.showList} />
        <JotList
          show={this.state.showList}
          jots={this.state.jots}
          hide={this.hideList}
        />
        <Pad
          handleCreateJot={this.handleCreateJot}
          socket={this.state.socket}
        />
        {this.state.jots.map(jotData => (
          <Jot key={jotData.id} socket={this.state.socket} {...jotData} />
        ))}
      </div>
    );
  }
}

export default App;
