import React, { PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/search_bar.scss'

class SearchBar extends React.Component {
	render() {
		return (
			<div styleName='search-bar-container'>
				<input type='text'
							 value={this.props.keyword}
							 onChange={this.handleChange.bind(this)}
							 styleName='search-bar' />
			</div>
		)
	}

	handleChange(event) {
		this.props.onSearch(event.target.value)
	}
}

SearchBar.propTypes = {
	keyword: PropTypes.string.isRequired,
	onSearch: PropTypes.func.isRequired
}

export default CSSModules(SearchBar, styles)