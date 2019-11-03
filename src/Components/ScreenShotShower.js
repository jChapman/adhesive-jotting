import React from "react";
import Modal from "react-modal";

const ScreenShotShower = props => {
  return (
    <Modal isOpen={props.show} onRequestClose={props.close}>
      <p>
        Below is your image, right click and select "save image to download"
      </p>
      Hit escape to exit
      <div id='imageHolder'/>
    </Modal>
  );
};

export default ScreenShotShower;
