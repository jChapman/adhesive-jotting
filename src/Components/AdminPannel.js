import React, {Component} from 'react';

class AdminPannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  showAdmin = () => {
    this.setState({show: true})
  }

  hideAdmin = () => {
    this.setState({show: false})
  }

  render = () => {
    return (
      <div>
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
            <button>Clear all</button>
            <button>Add Label</button>
            <button>Export to svg</button>
            <button>Export to list</button>
            <button>Show top votes</button>
          </div>
        )}
      </div>
    );
  };
}

export default AdminPannel;