import { connect } from 'react-redux'
import { selectPacket } from '../actions/selectActions'
import PacketList from '../components/PacketList'
import { isBuf } from '../../utils'

const mapStateToProps = (state) => {
	const keyword = state.updates.keyword.toLowerCase()
	const selectedSocket = state.select.socketFilter
	
	let packets = []

	for (var i = 0; i < state.updates.packets.length; i++) {
		let packet = state.updates.packets[i]
		let packetData
		if (packet.data[1] === undefined) {
			packetData = undefined;
		} else if (isBuf(packet.data[1])) {
			let encodedData = new Uint8Array(packet.data[1])
			if (encodedData.length > 64) {
				encodedData = new Uint8Array(packet.data[1], 0, 64);
			}
			packetData = encodedData.join('')
		} else if (typeof packet.data[1] === 'object') {
			packetData = JSON.stringify(packet.data[1], null, 2).toLowerCase()
		}

		if (selectedSocket.url === packet.url && 
			  selectedSocket.nsp === packet.nsp &&
				selectedSocket.sid === packet.sid) {
			if (keyword.length <= 0) {
				packets.push(packet)
			} else if (packetData && ~packetData.indexOf(keyword)) {
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