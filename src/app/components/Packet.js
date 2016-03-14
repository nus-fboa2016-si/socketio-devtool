import React, { PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/packet.scss'
import classnames from 'classnames'

class Packet extends React.Component {
	render() {
		return (
			<div>
				<li styleName={classnames('packet', {'selected': this.props.selected})}
				    onClick={this.props.onClick}>
					{this.props.packet.data[0]}
				</li>
			</div>
		)
	}
}

Packet.propTypes = {
	packet: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
	selected: PropTypes.bool.isRequired
}

export default CSSModules(Packet, styles, {allowMultiple: true})