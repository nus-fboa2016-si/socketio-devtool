import React from 'react'
import { connect } from 'react-redux'
import CSSModules from 'react-css-modules'
import PacketMetaData from './PacketMetaData'
import PacketData from './PacketData'
import styles from '../styles/packets_panel.scss'

class PacketContentBox extends React.Component {
	render() {
		if (this.props.isIoDetected) {
			return (
				<div styleName='right-content'>
					<PacketMetaData selectedPacket={this.props.selectedPacket}/>
					<PacketData selectedPacket={this.props.selectedPacket}/>
				</div>
			)
		}

		return (
			<div styleName='right-content'></div>
		)
	}
}

const mapStateToProps = function(state) {
	return {
		selectedPacket: state.select.packetFilter,
		isIoDetected: state.updates.isIoDetected
	}
}

export default connect(mapStateToProps, {})(CSSModules(PacketContentBox, styles))