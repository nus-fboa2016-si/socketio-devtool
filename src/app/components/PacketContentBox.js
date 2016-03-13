import React from 'react'
import CSSModules from 'react-css-modules'
import PacketMetaData from './PacketMetaData'
import PacketData from './PacketData'
import styles from '../styles/packets_panel.scss'

class PacketContentBox extends React.Component {
	render() {
		return (
			<div styleName='right-content'>
				<PacketMetaData />
				<PacketData />
			</div>
		)
	}
}

export default CSSModules(PacketContentBox, styles)