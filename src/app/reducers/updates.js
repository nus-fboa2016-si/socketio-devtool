const initialState = {
  sockets: {},
  packets: [],
  packetId: 1,
  isIoDetected: false,
  keyword: ''
};

function updates(state=initialState, action){
  switch(action.type){
    case 'ADD_PACKET':
      let sockets = Object.assign({}, state.sockets);
      let packet = Object.assign({}, action.packet);
      packet['id'] = state.packetId;

      action.packet.from === 'received' ?
        sockets[action.packet.nsp].receivedCount++
        :
        sockets[action.packet.nsp].sentCount++;
      return Object.assign({}, state, {
        packets: [...state.packets, packet],
        sockets: sockets,
        packetId: state.packetId + 1
      });

    case 'ADD_SOCKET':
      sockets = Object.assign({}, state.sockets);
      sockets[action.socket.nsp] = action.socket;
      sockets[action.socket.nsp].receivedCount = 0;
      sockets[action.socket.nsp].sentCount = 0;
      return Object.assign({}, state, {sockets: sockets});

    case 'SET_KEYWORD':
      return Object.assign({}, state, {keyword: action.keyword});

    case 'SET_IO_DETECTED':
      return Object.assign({}, state, {isIoDetected: true});

    case 'REINITIALISE':
      return initialState;

    default: return state;
  }
}

export default updates;