import { ADD_PACKET } from '../actions/action'

function packet(state, action) {
	switch (action.type) {
		case ADD_PACKET:
			return Object.assign({}, action.packet)
		default:
			return state
	}
}

function packets(state = [], action) {
  switch (action.type) {
    case ADD_PACKET:
      return [
      	...state,
      	packet(undefined, action)
      ]
    default:
      return state
  }
}

export default packets
