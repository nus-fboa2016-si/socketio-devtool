import React from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/search_bar.scss'

class SearchBar extends React.Component {
	render() {
		return (
			<div styleName='search-bar-container'>
				<input type='text' styleName='search-bar'/>
			</div>
		)
	}
}

export default CSSModules(SearchBar, styles)