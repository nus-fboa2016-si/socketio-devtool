import React, {PropTypes} from 'react';
import CSS from 'react-css-modules';
import styles from '../styles/socketinfo.scss';
import {numberWithCommas, dateFromNow} from '../../utils';

class SocketInfo extends React.Component{

  componentDidMount(){
    console.log('mount');
    this.timer();
  }

  timer(){
    console.log('timer ticking');
    //console.log(this);
    this.props.timeTick();
    window.setTimeout(this.timer.bind(this), 1000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }
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
                <span styleName="row-attrib">{selectedSocket.status}</span>
              </div>
              <div styleName="row">
                <span styleName="row-title">ELAPSED:</span>
                <span styleName="row-attrib">{dateFromNow(selectedSocket.timestamp)}</span>
              </div>
            </div>
          </div>
          <div styleName="panel right">
            <div styleName="column">
              <div styleName="block-info">
                <span styleName="block-title">EVENTS RECEIVED:</span>
                <span styleName="block-attrib">{numberWithCommas(selectedSocket.receivedCount)}</span>
              </div>
            </div>
            <div styleName="column">
              <div styleName="block-info">
                <span styleName="block-title">EVENTS SENT:</span>
                <span styleName="block-attrib">{numberWithCommas(selectedSocket.sentCount)}</span>
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
};


export default CSS(SocketInfo, styles, {allowMultiple: true});

