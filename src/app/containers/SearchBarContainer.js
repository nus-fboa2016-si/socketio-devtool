import { connect } from 'react-redux'
import { setKeyword } from '../actions/updateActions'
import SearchBar from '../components/SearchBar'

const mapStateToProps = (state) => {
	return {
		keyword: state.updates.keyword
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSearch: (keyword) => {
			console.log("Dispatching Set Keyword")
			dispatch(setKeyword(keyword))
		}
	}
}

const SearchBarContainer = connect(mapStateToProps, mapDispatchToProps)(SearchBar)

export default SearchBarContainer