import React from 'react'
import { connect } from 'react-redux'
import CSSModules from 'react-css-modules'
import PacketMetaDataContainer from '../containers/PacketMetaDataContainer'
import PacketDataContainer from '../containers/PacketDataContainer'
import styles from '../styles/packets_panel.scss'

class PacketContentBox extends React.Component {
	render() {
		if (this.props.isIoDetected) {
			return (
				<div styleName='right-content'>
					<PacketMetaDataContainer />
					<PacketDataContainer />
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
		isIoDetected: state.updates.isIoDetected
	}
}

export default connect(mapStateToProps, {})(CSSModules(PacketContentBox, styles))