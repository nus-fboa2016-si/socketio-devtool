import React, { PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import Packet from './Packet'
import styles from '../styles/packet_list.scss'

class PacketList extends React.Component {
	renderPacketList(packets) {
		let packetList = []
		for (var i = 0; i < packets.length; i++) {
			let packet = packets[i]
			packetList.push(
				<Packet key={packet.id}
								packet={packet}
						    onClick={this.props.onPacketClick.bind(this, packet)} 
						    selected={packet === this.props.selectedPacket} 
				/>
			)
		}

		return packetList
	}

	render() {
		return (
			<ul styleName='packet-list'>
				{this.renderPacketList(this.props.packets)}
			</ul>
		)
	}
}

PacketList.propTypes = {
	packets: PropTypes.array.isRequired
}

export default CSSModules(PacketList, styles)
