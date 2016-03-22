import React, {PropTypes} from 'react';
import CSS from 'react-css-modules';
import styles from '../styles/sockets.scss';
import classnames from 'classnames';

class Socket extends React.Component {
  render(){
    const {socket, selected, onClick} = this.props;
    console.log('socket', socket);
    return (
      <div styleName={classnames("socket", {'selected': selected})} onClick={onClick}>
        {socket.url}
        <span styleName="socket-namespace">{socket.nsp}</span>
      </div>
    );
  }
}

Socket.propTypes = {
  socket: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};


export default CSS(Socket, styles, {allowMultiple: true});