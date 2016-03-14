import React, { PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/packet_meta_data.scss'
import { getPacketType } from '../../utils'

class PacketMetaData extends React.Component {
	render() {
		let packetType = '';
		if (Object.keys(this.props.selectedPacket).length > 0) {
			packetType = getPacketType(this.props.selectedPacket.type)
		}

		return (
			<div styleName='packet-meta-data-panel'>
				<div styleName='packet-type'>
					PACKET TYPE <span styleName='packet-meta-value'>{packetType}</span>
				</div>
				<div styleName='packet-timestamp'>
					RECEIVED <span styleName='packet-meta-value'>3m 2s ago</span>
				</div>
			</div>
		)
	}
}

PacketMetaData.propTypes = {
	selectedPacket: PropTypes.object.isRequired
}

export default CSSModules(PacketMetaData, styles)
