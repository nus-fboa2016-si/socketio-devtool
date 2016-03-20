import { connect } from 'react-redux'
import { selectPacket } from '../actions/selectActions'
import PacketList from '../components/PacketList'

const mapStateToProps = (state) => {
	const keyword = state.updates.keyword.toLowerCase()
	
	let packets = [];

  if (keyword.length <= 0) {
  	packets = state.updates.packets
  } else {
  	for (var i = 0; i < state.updates.packets.length; i++) {
	    let packet = state.updates.packets[i]
	    let packetData = JSON.stringify(packet.data[1], null, 2).toLowerCase()
	    if (~packetData.indexOf(keyword)) {
	      packets.push(packet)
	    }
	  }
  }
  return {
  	packets: packets,
  	selectedPacket: state.select.packetFilter,
		selectedSocket: state.select.socketFilter
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
		onPacketClick: (packet) => {
			dispatch(selectPacket(packet))
		}
	}
}

const PacketListContainer = connect(mapStateToProps, mapDispatchToProps)(PacketList)

export default PacketListContainer