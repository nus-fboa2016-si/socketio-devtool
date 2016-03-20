require('../styles/app.scss')

import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {addPacket, addSocket, setIoDetected, reinitialise, updateLatency} from '../actions/updateActions';
import CSSModules from 'react-css-modules';
import SearchablePacketListBox from './SearchablePacketListBox';
import PacketContentBox from './PacketContentBox';
import Header from './Header';
import styles from '../styles/packets_panel.scss';
import messenger from '../../chrome/src/connect';

class App extends React.Component {
	constructor(props) {
		super(props);
		document.getElementById('socketio-devtool').style.height = '100%';
	}

	componentDidMount(){
		const {addSocket, addPacket, setIoDetected, reinitialise, updateLatency} = this.props;
		messenger.on('io', function(ioDetect){
			if(ioDetect === 'global-io'){
				setIoDetected();
			}
		});
		messenger.on('socket', function(socket){
			addSocket(socket);
		});
		messenger.on('packetRcv', function(packet){
			packet.from = 'received';
			addPacket(packet);
		});
		messenger.on('packetCreate', function(packet){
			packet.from = 'created';
			addPacket(packet);
		});
		messenger.on('pong', function(packet){
			updateLatency(packet);
		});
		messenger.on('reinit', function(){
			reinitialise();
		});
		messenger.run();
	};

	render() {
		return (
			<div styleName='App'>
				<Header/>
				<div styleName='main-content'>
					<SearchablePacketListBox />
					<PacketContentBox />
				</div>
			</div>
		);
	}
}

App.propTypes = {
	addSocket: PropTypes.func,
	addPacket: PropTypes.func
};

const mapStateToProps = function(state){
	return state;
};

const mapDispatchToProps = function(){
	return {
		addSocket,
		addPacket,
		setIoDetected,
		reinitialise,
		updateLatency
	};
}
export default connect(mapStateToProps, {
	addSocket,
	addPacket,
	setIoDetected,
	reinitialise,
	updateLatency
})(CSSModules(App,styles));
