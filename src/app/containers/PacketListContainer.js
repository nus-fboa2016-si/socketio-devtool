import { connect } from 'react-redux'
import { selectPacket } from '../actions/selectActions'
import PacketList from '../components/PacketList'

const mapStateToProps = (state) => {
	const keyword = state.updates.keyword.toLowerCase()
	const selectedSocket = state.select.socketFilter
	
	let packets = []

	for (var i = 0; i < state.updates.packets.length; i++) {
		let packet = state.updates.packets[i]
		let packetData = JSON.stringify(packet.data[1], null, 2).toLowerCase()
		if (selectedSocket.url === packet.url && 
			  selectedSocket.nsp === packet.nsp) {
			if (keyword.length <= 0) {
				packets.push(packet)
			} else if (~packetData.indexOf(keyword)) {
	      packets.push(packet)
	    }
		}
	}

  return {
  	packets: packets,
  	selectedPacket: state.select.packetFilter
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