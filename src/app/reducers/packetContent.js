import { DISPLAY_PACKET_CONTENT } from '../actions/action'

function packetContent(state, action) {
	switch (action.type) {
		case DISPLAY_PACKET_CONTENT:
			// return packet content with the given action.id
		default:
			return state
	}
}

export default packetContent