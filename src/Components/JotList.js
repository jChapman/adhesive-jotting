import React from "react";
import Modal from "react-modal";

const JotList = props => {
  return (
    <Modal isOpen={props.show} onRequestClose={props.hide}>
      <ul>
        {props.jots.map(jotData => (
          <li key={jotData.id}>{jotData.text}</li>
        ))}
      </ul>
    </Modal>
  );
};

export default JotList;
