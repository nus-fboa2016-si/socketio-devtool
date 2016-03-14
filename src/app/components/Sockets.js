import React, {PropTypes} from 'react';
import Socket from './Socket';
import CSS from 'react-css-modules';
import styles from '../styles/sockets.scss';
class Sockets extends React.Component {
  render(){
    const sockets = this.props.sockets;
    var socketDom = this.renderSockets(sockets);
    if(0 <= socketDom.length) {

      return (
        <div styleName="sockets">
          {socketDom}
        </div>);
    }else{
      return (<div className="socket-msg">
        Detecting sockets...
      </div>);
    }
  };

  renderSockets(sockets){
    let socketArr = [];
    console.log('sockets', sockets);
    console.log(sockets['/']);
    for(var socket in sockets){
      console.log('socket', socket);
      if(sockets.hasOwnProperty(socket)){
        socketArr.push(<Socket key={sockets[socket].nsp} socket={sockets[socket]}/>);
      }
    }
    return socketArr;
  };
}

Sockets.propTypes = {
  sockets: PropTypes.object.isRequired
};


export default CSS(Sockets, styles);