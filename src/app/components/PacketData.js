import React from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/packet_data.scss'
import Highlight from 'react-highlight'

const data = JSON.stringify({"message": "hey how are you doing?", "user_id": 50}, null, 2)

class PacketData extends React.Component {
	render() {
		return (
			<div styleName='packet-data-panel'>
				<div styleName='packet-data-header'>DATA</div>
				<Highlight styleName='packet-data'>
					{data}
				</Highlight>
			</div>
		)
	}
}

export default CSSModules(PacketData, styles)