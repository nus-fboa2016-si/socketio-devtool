import React from 'react'
import CSSModules from 'react-css-modules'
import SearchBar from './SearchBar'
import PacketList from './PacketList'
import styles from '../styles/packets_panel.scss'

class SearchablePacketListBox extends React.Component {
	render() {
		return (
			<div styleName='left-content'>
				<SearchBar />
				<PacketList />
			</div>
		)
	}
}

export default CSSModules(SearchablePacketListBox, styles)