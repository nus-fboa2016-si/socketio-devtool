import React, { PropTypes } from 'react'

class Packet extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <li onClick={this.props.onClick}>
        {this.props.event}
      </li>
    )
  }
}

Packet.propTypes = {
  _id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  event: PropTypes.string.isRequired,
  data: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Packet
