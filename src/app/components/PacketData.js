import React, { PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/packet_data.scss'
import Highlight from 'react-highlight'
import Highlighter from 'react-highlighter'

class PacketData extends React.Component {
	renderPacketData(packet) {
		if (Object.keys(packet).length > 0) {
			if (packet.data[1] === undefined) {
				return (
					<div styleName="packet-data-no-content">
						&lt;NO CONTENT&gt;
					</div>
				)
			}
			var packetData;
			if(typeof packet.data[1] === 'string') {
				packetData = JSON.stringify(packet.data[1], null, 2)
			}else{
				//binary data
				var redacted = false;
				var encodedData = new Uint8Array(packet.data[1]);
				if(encodedData.length > 64){
					encodedData = new Uint8Array(packet.data[1], 0, 64);
					redacted = true;
				}
				encodedData = encodedData.reduce(function(prevVal, currentVal, index){
					var val = currentVal.toString(16).toUpperCase();
					if(val.length === 1) val = '0' + val;
					if((index+1)%8 === 0){
						return prevVal + val + '\n';
					}
					if((index+1)%4 === 0){
						return prevVal + val + '  ';
					}
					if((index+1)%2 === 0){
						return prevVal + val + ' ';
					}
					return prevVal + val;
				}, '');
				packetData = encodedData + (redacted ? '...' : '');
			}

			return (
				<Highlight styleName='packet-data'>
					<Highlighter search={this.props.searchQuery} 
											 matchStyle={{ backgroundColor: '#00ff00' }}>
						{packetData}
					</Highlighter>
				</Highlight>
			)
		}
	}

	render() {
		return (
			<div styleName='packet-data-panel'>
				<div styleName='packet-data-header'>DATA</div>
				{this.renderPacketData(this.props.selectedPacket)}
			</div>
		)
	}
}

PacketData.propTypes = {
	selectedPacket: PropTypes.object.isRequired,
	searchQuery: PropTypes.string.isRequired
}

export default CSSModules(PacketData, styles)