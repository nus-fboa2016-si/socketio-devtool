import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import CSSModules from 'react-css-modules'
import Packet from './Packet'
import styles from '../styles/packet_list.scss'
import { selectPacket } from '../actions/selectActions'

class PacketList extends React.Component {
	renderPacketList(packets) {
		let packetList = []
		for (var i = 0; i < packets.length; i++) {
			let packet = packets[i]
			packetList.push(
				<Packet packet={packet}
						    onClick={this.onClick.bind(this, packet)}
						    selected={packet === this.props.selectedPacket} 
				/>
			)
		}

		return packetList
	}

	onClick(packet) {
		this.props.selectPacket(packet)
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
	packets: PropTypes.array.isRequired,
	selectPacket: PropTypes.func.isRequired
}

const mapStateToProps = function(state) {
	return {
		selectedPacket: state.select.packetFilter
	}
}

export default connect(mapStateToProps, { selectPacket })(CSSModules(PacketList, styles))
