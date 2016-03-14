import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from '../styles/header.scss';

class Header extends React.Component {
  render(){
    console.log("SOCKETS", this.props);
    return (
      <div styleName="header">
        
      </div>
    );
  }
}

const mapStateToProps = function(state){

  return ({
    sockets: state.updates.sockets,
    isIoDetected: state.updates.isIoDetected
  });
};


export default connect(mapStateToProps, {})(CSSModules(Header, styles));
