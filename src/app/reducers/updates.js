const initialState = {
  sockets: {},
  packets: [],
  isIoDetected: false
};

function updates(state=initialState, action){
  switch(action.type){
    case 'ADD_PACKET':
      let sockets = Object.assign({}, state.sockets);
      action.packet.from === 'received' ?
        sockets[action.packet.nsp].receivedCount++
        :
        sockets[action.packet.nsp].sentCount++;
      return Object.assign({}, state, {
        packets: [...state.packets, action.packet],
        sockets: sockets
      });

    case 'ADD_SOCKET':
      sockets = Object.assign({}, state.sockets);
      sockets[action.socket.nsp] = action.socket;
      sockets[action.socket.nsp].receivedCount = 0;
      sockets[action.socket.nsp].sentCount = 0;
      return Object.assign({}, state, {sockets: sockets});

    case 'SET_IO_DETECTED':
      return Object.assign({}, state, {isIoDetected: true});

    case 'REINITIALISE':
      return initialState;
    default: return state;
  }
}

export default updates;