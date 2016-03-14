import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {addPacket, addSocket} from '../actions/updateActions';
import CSSModules from 'react-css-modules';
import SearchablePacketListBox from './SearchablePacketListBox';
import PacketContentBox from './PacketContentBox';
import Header from './Header';
import styles from '../styles/packets_panel.scss';
import messenger from '../../chrome/src/connect';

class App extends React.Component {
	constructor(props) {
		super(props);
		document.body.style.width = '100%';
		document.body.style.height = '100%';
		document.body.style.margin = '0px';
		document.body.style.padding = '0';
	}

	componentDidMount(){
		const {addSocket, addPacket} = this.props;

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
		console.log(this.props, this.state);
		return (
			<div styleName='main-content'>
				<Header/>
				<div className="body">
					<SearchablePacketListBox />
					< PacketContentBox />
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

export default connect(mapStateToProps, {addSocket, addPacket})(CSSModules(App,styles));
