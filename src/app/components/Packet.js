import React, { PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/packet.scss'
import classnames from 'classnames'
import { stringToColorCode } from '../../utils'

class Packet extends React.Component {
	render() {
		const event = this.props.packet.data[0]
		const color = '#' + stringToColorCode(event)
		return (
			<li styleName={classnames('packet-container', {'selected': this.props.selected})}
			    onClick={this.props.onClick}>
				<div styleName='color' style={{ backgroundColor: color }}></div>
				<div styleName='packet'>{event}</div>
			</li>
		)
	}
}

Packet.propTypes = {
	packet: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
	selected: PropTypes.bool.isRequired
}

export default CSSModules(Packet, styles, {allowMultiple: true})