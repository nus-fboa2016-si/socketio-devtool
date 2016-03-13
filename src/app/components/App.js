import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {addPacket, addSocket} from '../actions/updateActions';

class App extends React.Component {
	componentDidMount(){
		const {addSocket, addPacket} = this.props;
		let messenger = window['__SOCKETIO-DEVTOOL-MESSENGER__'];
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
	};

	render() {
		return (
			<div>
			</div>
		)
	}
}

App.propTypes = {
	addSocket: PropTypes.func,
	addPacket: PropTypes.func
};

const mapStateToProps = function(state){
	return {};
};

export default connect(mapStateToProps, {addSocket, addPacket})(App);