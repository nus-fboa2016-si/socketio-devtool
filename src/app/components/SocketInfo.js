import React, {PropTypes} from 'react';
import CSS from 'react-css-modules';
import styles from '../styles/socketinfo.scss';
//import {connect} from 'react-redux';


class SocketInfo extends React.Component{
  render(){
    const {selectedSocket} = this.props;
    if(0 === Object.keys(selectedSocket).length){
      return (
        <div styleName="Socket-Info">
          <div styleName="select-socket-msg">
            Select a socket to see more details...
          </div>
        </div>
      );
    }else{
      return (
        <div styleName="Socket-Info">
          <div styleName="panel left">
            <div styleName="column">
              <div styleName="row">
                <span styleName="row-title">HOSTNAME:</span>
                <span styleName="row-attrib">{selectedSocket.url}</span>
              </div>
              <div styleName="row">
                <span styleName="row-title">NAMESPACE:</span>
                <span styleName="row-attrib">{selectedSocket.nsp}</span>
              </div>
            </div>
            <div styleName="column">
              <div styleName="row">
                <span styleName="row-title">STATUS:</span>
                <span styleName="row-attrib"></span>
              </div>
              <div styleName="row">
                <span styleName="row-title">ELAPSED:</span>
                <span styleName="row-attrib"></span>
              </div>
            </div>
          </div>
          <div styleName="panel right">
            <div styleName="column">
              <div styleName="block-info">
                <span styleName="block-title">EVENTS RECEIVED:</span>
                <span styleName="block-attrib"></span>
              </div>
            </div>
            <div styleName="column">
              <div styleName="block-info">
                <span styleName="block-title">EVENTS SENT:</span>
                <span styleName="block-attrib"></span>
              </div>
            </div>
            <div styleName="column">
              <div styleName="block-info">
                <span styleName="block-title">LATENCY:</span>
                <span styleName="block-attrib"></span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

SocketInfo.propTypes = {
  selectedSocket: PropTypes.object.isRequired
}

export default CSS(SocketInfo, styles, {allowMultiple: true});

