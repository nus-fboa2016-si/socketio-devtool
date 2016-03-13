import React from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/packet.scss'

class Packet extends React.Component {
	render() {
		return (
			<div>
				<li styleName='packet'>Packet Name 1</li>
				<li styleName='packet'>Packet Name 2</li>
				<li styleName='packet'>Packet Name 3</li>
			</div>
		)
	}
}

export default CSSModules(Packet, styles)