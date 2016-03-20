import React from 'react'
import { connect } from 'react-redux'
import CSSModules from 'react-css-modules'
import SearchBarContainer from '../containers/SearchBarContainer'
import PacketListContainer from '../containers/PacketListContainer'
import styles from '../styles/packets_panel.scss'

class SearchablePacketListBox extends React.Component {
	render() {
		if (this.props.isIoDetected && this.props.selectedSocket !== {}) {
			const keyword = this.props.keyword
			return (
				<div styleName='left-content'>
					<SearchBarContainer />
					<PacketListContainer />
				</div>
			)
		}

		return (
			<div styleName='left-content'></div>
		)
	}
}

const mapStateToProps = function(state) {
	return {
		isIoDetected: state.updates.isIoDetected,
		selectedSocket: state.select.socketFilter
	}
}

export default connect(mapStateToProps, {})(CSSModules(SearchablePacketListBox, styles))
