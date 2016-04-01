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
		this.state = { active: -1 }
	}

	render() {
		return (
			<AutoSizer ref='AutoSizer'>
				{({ width, height }) => (
					<VirtualScroll
						ref='VirtualScroll'
						className={styles.list}
						width={width}
						height={height}
						rowsCount={this.props.packets.length}
						overscanRowsCount={10}
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
							onClick={this.handlePacketClick.bind(this, packet)}
							selected={packet.id === this.state.active}
			/>
		)
	}

	handlePacketClick(packet) {
		this.setState({ active: packet.id })
		this.refs.AutoSizer.refs.VirtualScroll.recomputeRowHeights()
		this.props.onPacketClick(packet)
	}
}

PacketList.propTypes = {
	packets: PropTypes.array.isRequired,
	selectedPacket: PropTypes.object.isRequired,
	onPacketClick: PropTypes.func.isRequired
}

export default CSSModules(PacketList, styles)
