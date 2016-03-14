import React from 'react'
import { connect } from 'react-redux'
import CSSModules from 'react-css-modules'
import SearchBar from './SearchBar'
import PacketList from './PacketList'
import styles from '../styles/packets_panel.scss'

class SearchablePacketListBox extends React.Component {
	render() {
		return (
			<div styleName='left-content'>
				<SearchBar />
				<PacketList packets={this.props.packets}/>
			</div>
		)
	}
}

const mapStateToProps = function(state) {
	return {
		packets: state.updates.packets
	}
}

export default connect(mapStateToProps, {})(CSSModules(SearchablePacketListBox, styles))