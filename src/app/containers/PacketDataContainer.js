import { connect } from 'react-redux'
import PacketData from '../components/PacketData'

const mapStateToProps = (state) => {
	return {
		selectedPacket: state.select.packetFilter,
		searchQuery: state.updates.keyword
	}	
}

const PacketDataContainer = connect(mapStateToProps, {})(PacketData)

export default PacketDataContainer