import React, { PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/packet_data.scss'
import Highlight from 'react-highlight'

class PacketData extends React.Component {
	renderPacketData(packet) {
		if (Object.keys(packet).length > 0) {
			let packetData = JSON.stringify(packet.data[1], null, 2)

			return (
				<Highlight styleName='packet-data'>
					{packetData}
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
	selectedPacket: PropTypes.object.isRequired
}

export default CSSModules(PacketData, styles)