import React from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/packet_meta_data.scss'

class PacketMetaData extends React.Component {
	render() {
		return (
			<div styleName='packet-meta-data-panel'>
				<div styleName='packet-type'>
					PACKET TYPE <span styleName='packet-meta-value'>USER EVENT</span>
				</div>
				<div styleName='packet-timestamp'>
					RECEIVED <span styleName='packet-meta-value'>3m 2s ago</span>
				</div>
			</div>
		)
	}
}

export default CSSModules(PacketMetaData, styles)