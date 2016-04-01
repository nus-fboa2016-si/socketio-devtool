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

			let packetData = JSON.stringify(packet.data[1], null, 2)

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