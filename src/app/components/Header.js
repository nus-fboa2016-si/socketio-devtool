import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Sockets from './Sockets';
import CSSModules from 'react-css-modules';
import styles from '../styles/header.scss';
import SocketInfo from './SocketInfo';
import {timeTick} from '../actions/updateActions';
import {selectSocket} from '../actions/selectActions';
class Header extends React.Component {
  render(){
    const {isIoDetected, sockets, selectedSocket, timeTick, selectSocket} = this.props;
    console.log('HEADER', sockets, Object.keys(sockets), this.props);
    return (
      <div styleName="header">
        <Sockets selectSocket={selectSocket}/>
        {isIoDetected ?
          Object.keys(sockets).length === 0 ?
              <div styleName="header-msg">Detecting Sockets...</div>
              :
              <SocketInfo selectedSocket={selectedSocket} timeTick={timeTick}/>
          :
          <div styleName="header-msg">No global `io` detected...</div>}
      </div>
    );
  }
}

const mapStateToProps = function(state){
  console.log('header', state.updates.sockets);
  return ({
    sockets: state.updates.sockets,
    isIoDetected: state.updates.isIoDetected,
    selectedSocket: state.select.socketFilter,
    currentTime: state.updates.currentTime //triggers component to update.
  });
};


export default connect(mapStateToProps, {timeTick, selectSocket})(CSSModules(Header, styles));
