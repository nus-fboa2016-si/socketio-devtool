import React, { PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/packet_meta_data.scss'

class PacketMetaData extends React.Component {
	render() {
		return (
			<div styleName='packet-meta-data-panel'>
				<div styleName='packet-type'>
					PACKET TYPE 
					<span styleName='packet-meta-value'>
						{this.props.packetType}
					</span>
				</div>
				<div styleName='packet-timestamp'>
					{this.props.isReceived ? 'RECEIVED' : 'CREATED'}
					<span styleName='packet-meta-value'>
						{this.props.elapsedTime}
					</span>
				</div>
			</div>
		)
	}
}

PacketMetaData.propTypes = {
	packetType: PropTypes.string.isRequired,
	elapsedTime: PropTypes.string.isRequired,
	isReceived: PropTypes.boolean.isRequired
}

export default CSSModules(PacketMetaData, styles)
