import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import CSS from 'react-css-modules';
import styles from '../styles/sockets.scss';

import Socket from './Socket';

class Sockets extends React.Component {
  render(){
    const sockets = this.props.sockets;
    console.log('rendering:', sockets);
      return (
        <div styleName="sockets">
          {this.renderSockets(sockets)}
        </div>);
  };

  renderSockets(sockets){
    let socketArr = [];
    for(var socket in sockets){
        socketArr.push(
          <Socket key={sockets[socket].sid+sockets[socket].nsp}
                  socket={sockets[socket]}
                  onClick={this.onClick.bind(this, sockets[socket])}
                  selected={sockets[socket].sid === this.props.selectedSocket.sid &&
                    sockets[socket].nsp === this.props.selectedSocket.nsp}
          />);
    }
    return socketArr;
  };

  onClick(socket){
    this.props.selectSocket(socket);
  }
}

Sockets.propTypes = {
  sockets: PropTypes.object.isRequired,
  selectSocket: PropTypes.func.isRequired
};

const mapStateToProps = function(state){
  //console.log('sockets', state.updates.sockets);
  return {
    selectedSocket: state.select.socketFilter,
    sockets: state.updates.sockets
  }
};
export default connect(mapStateToProps, {})(CSS(Sockets, styles));