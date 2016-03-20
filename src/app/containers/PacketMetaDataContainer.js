import { connect } from 'react-redux'
import PacketMetaData from '../components/PacketMetaData'
import { getPacketType, dateFromNow } from '../../utils'

const mapStateToProps = (state) => {

	const selectedPacket = state.select.packetFilter;

	let packetType = '';
	let elapsedTime = '';
	if (Object.keys(selectedPacket).length > 0) {
		packetType = getPacketType(selectedPacket.type);
		elapsedTime = dateFromNow(selectedPacket.timestamp);

	}

	return {
		packetType: packetType,
		elapsedTime: elapsedTime,
		isReceived: selectedPacket.from === 'received'
	}
};

const PacketMetaDataContainer = connect(mapStateToProps, {})(PacketMetaData);

export default PacketMetaDataContainer