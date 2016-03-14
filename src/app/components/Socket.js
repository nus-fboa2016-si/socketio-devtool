import React, {PropTypes} from 'react';
import CSS from 'react-css-modules';
import styles from '../styles/sockets.scss';

class Socket extends React.Component {
  render(){
    const socket = this.props.socket;
    return (
      <div styleName="socket">
        {socket.url+socket.nsp}
      </div>
    );
  }
}

Socket.propTypes = {
  socket: PropTypes.object.isRequired
};
export default CSS(Socket, styles);