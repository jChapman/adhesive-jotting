import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import openSocket from "socket.io-client";
import "./App.css";
import Room from "./Components/Room";

const SERVER_URL = `ws://${window.location.host.split(":")[0]}:8000`;
const socket = openSocket(SERVER_URL);

const App = () => {
  const [roomList, setRoomList] = useState([]);
  socket.on("room list", newRoomList => setRoomList(newRoomList));
  socket.emit("create room", "test room");
  return (
    <Router>
      <Switch>
        {/*<Route path="/room/:id" children={<Room socket={socket}/>}/>*/}
        <Route path="/room/:id">
          <Room socket={socket} />
        </Route>
        <Route path="/">
          <>
            <ul>
              {roomList.map(({ name, id }) => (
                <li key={id}>
                  {name}{" "}
                  <Link to={`/room/${id}`}>
                    <button>Join</button>
                  </Link>
                </li>
              ))}
            </ul>
            This is the home, should probably list rooms here
          </>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
