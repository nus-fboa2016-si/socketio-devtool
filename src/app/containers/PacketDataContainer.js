import { connect } from 'react-redux'
import PacketData from '../components/PacketData'

const mapStateToProps = (state) => {
	return {
		selectedPacket: state.select.packetFilter
	}	
}

const PacketDataContainer = connect(mapStateToProps, {})(PacketData)

export default PacketDataContainer