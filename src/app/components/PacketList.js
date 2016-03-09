import React, { PropTypes } from 'react'
import Packet from './Packet'

class PacketList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ul>
        {this.props.packets.map((packet) => {
          <Packet 
            key={packet._id}
            {...packet}
            onClick={() => onPacketClick(packet._id)}
          />
        })}
      </ul>
    )
  }
}

PacketList.propTypes = {
  packets: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    event: PropTypes.string.isRequired,
    data: PropTypes.any.isRequired
  }).isRequired).isRequired,
  onPacketClick: PropTypes.func.isRequired 
}

export default PacketList