import React, { useState,  useEffect } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";

import Pad from "./Pad";
import Jot from "./Jot";
import JotList from "./JotList";
import AdminPannel from "./AdminPannel";
import ScreenShotShower from "./ScreenShotShower";

const Room = props => {
  const [jots, setJots] = useState([])
  const [listVisible, setListVisible] = useState(false)
  const [imageVisible, setImageVisible] = useState(false)
  const [roomId] = useState(useParams().id)
  const socket = props.socket;

  useEffect(()=> {
    if (props.socket.connected) {
      props.socket.emit('connect to', roomId)
    } else {
      props.socket.on("connected", () => {
        setJots([]);
        props.socket.emit("connect to", roomId);
      })
    }
  }, [props.socket, roomId])


  socket.on("create jot", jotData => {
    // Ignore new's if we already have that jot
    if (jots.filter(jot => jot.id === jotData.id).length > 0) return;
    setJots([...jots, jotData]);
  });

  socket.on("delete jot", jotData => {
    setJots(jots.filter(jot => jot.id !== jotData.id));
  });

  const showList = () => {
    setListVisible(true);
  };

  const hideList = () => {
    setListVisible(false);
  };

  const saveImage = () => {
    setImageVisible(true);
    html2canvas(document.body).then(function(canvas) {
      let imageHolder = document.querySelector("#imageHolder");
      imageHolder.appendChild(canvas);
    });
  };

  const hideImage = () => {
    setImageVisible(false);
  };

  return (
    <div className="App">
      <AdminPannel showList={showList} saveImage={saveImage} socket={socket} />
      <JotList show={listVisible} jots={jots} hide={hideList} />
      <ScreenShotShower show={imageVisible} close={hideImage} />
      <div id="jotContents">
        <Pad socket={socket} roomId={roomId} />
        {jots.map(jotData => (
          <Jot key={jotData.id} socket={socket} {...jotData} roomId={roomId} />
        ))}
      </div>
    </div>
  );
};

export default Room;
