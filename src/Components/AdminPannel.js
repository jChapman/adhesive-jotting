import React, {useState} from 'react';

const AdminPannel = (props) => {
  const [show, changeShow] = useState(false)

  const showAdmin = () => {
    changeShow(true)
  }

  const hideAdmin = () => {
    changeShow(false)
  }

  const clearAll = () => {
    props.socket.emit("delete all");
  }

  return (
    <>
      {!show && (
        <img
          src="super.svg"
          width="24px"
          alt="Ssh, it's a secret"
          style={{ position: "absolute" }}
          onClick={showAdmin}
        />
      )}
      {show && (
        <div className="admin-menu">
          <button onClick={hideAdmin}>Close admin pannel</button>
          <button onClick={props.showList}>Export to list</button>
          <button onClick={props.saveImage}>Save as image</button>
          <button onClick={clearAll}>Clear all</button>
        </div>
      )}
    </>
  );
}
export default AdminPannel;