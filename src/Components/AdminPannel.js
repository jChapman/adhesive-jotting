import React, {Component} from 'react';

class AdminPannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      socket: props.socket,
    };
  }

  showAdmin = () => {
    this.setState({show: true})
  }

  hideAdmin = () => {
    this.setState({show: false})
  }

  clearAll = () => {
    this.props.socket.emit("delete all");
  }

  render = () => {
    return (
      <>
        {!this.state.show && (
          <img
            src="super.svg"
            width="24px"
            alt="Ssh, it's a secret"
            style={{ position: "absolute" }}
            onClick={this.showAdmin}
          />
        )}
        {this.state.show && (
          <div className="admin-menu">
            <button onClick={this.hideAdmin}>Close admin pannel</button>
            <button onClick={this.props.showList}>Export to list</button>
            <button onClick={this.props.saveImage}>Save as image</button>
            <button onClick={this.clearAll}>Clear all</button>
          </div>
        )}
      </>
    );
  };
}

export default AdminPannel;