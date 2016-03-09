require('normalize.css');
require('styles/App.scss');

import React from 'react';
import VisiblePacketList from '../containers/VisiblePacketList'
import PacketContent from './PacketContent'

class AppComponent extends React.Component {
  render() {
    return (
      <div>
      	<VisiblePacketList />
      	<PacketContent />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
