import React from 'react';
import CSS from 'react-css-modules';
import styles from '../styles/socketinfo.scss';

class SocketInfo extends React.Component{
  render(){
    return (<div className="Socket-Info">SocketInfo</div>);
  }
}


export default CSS(SocketInfo, styles);

