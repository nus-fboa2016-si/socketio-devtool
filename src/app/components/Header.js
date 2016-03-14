import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Sockets from './Sockets';
import CSSModules from 'react-css-modules';
import styles from '../styles/header.scss';

class Header extends React.Component {
  render(){
    const {isIoDetected, sockets} = this.props;
    console.log("SOCKETS", sockets);
    if(!isIoDetected){
      return (
        <div styleName="header">
          <div styleName="header-msg">No global `io` detected. </div>
        </div>
      );
    }else {
      return (
        <div styleName="header">
          <Sockets sockets={sockets}/>
        </div>
      );
    }
  }
}

const mapStateToProps = function(state){

  return ({
    sockets: state.updates.sockets,
    isIoDetected: state.updates.isIoDetected
  });
};


export default connect(mapStateToProps, {})(CSSModules(Header, styles));
