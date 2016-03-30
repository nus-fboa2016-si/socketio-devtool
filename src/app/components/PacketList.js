import React, { PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import Packet from './Packet'
import styles from '../styles/packet_list.scss'
import { AutoSizer, VirtualScroll } from 'react-virtualized'
import 'react-virtualized/styles.css';

class PacketList extends React.Component {
	constructor(props) {
		super(props)

		this.rowPacketRenderer = this.rowPacketRenderer.bind(this)
	}
	
	// renderPacketList(packets) {
	// 	let packetList = [];
	// 	for (var i = 0; i < packets.length; i++) {
	// 		let packet = packets[i];
	// 		packetList.push(
	// 			<Packet key={packet.id}
	// 							packet={packet}
	// 							onClick={this.props.onPacketClick.bind(this, packet)}
	// 							selected={packet === this.props.selectedPacket}
	// 			/>
	// 		)
	// 	}

	// 	return packetList
	// }

	render() {
		return (
			<AutoSizer>
				{({ width, height }) => (
					<VirtualScroll
						className={styles.list}
						width={width}
						height={height}
						rowsCount={this.props.packets.length}
						rowHeight={33}
						rowRenderer={this.rowPacketRenderer}
					/>
				)}
			</AutoSizer>
		)
	}

	rowPacketRenderer(index) {
		let packet = this.props.packets[index]
		return (
			<Packet key={packet.id}
							packet={packet}
							onClick={this.props.onPacketClick.bind(this, packet)}
							selected={packet === this.props.selectedPacket}
			/>
		)
	}
}

PacketList.propTypes = {
	packets: PropTypes.array.isRequired,
	selectedPacket: PropTypes.object.isRequired,
	onPacketClick: PropTypes.func.isRequired
}

export default CSSModules(PacketList, styles)
