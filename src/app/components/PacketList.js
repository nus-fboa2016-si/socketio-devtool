import React from 'react'
import CSSModules from 'react-css-modules'
import Packet from './Packet'
import styles from '../styles/packet_list.scss'

class PacketList extends React.Component {
	render() {
		return (
			<ul styleName='packet-list'>
				<Packet />
			</ul>
		)
	}
}

export default CSSModules(PacketList, styles)