const initialState = {
  sockets: {},
  packets: [],
  isIoDetected: false
};

function updates(state=initialState, action){
  switch(action.type){
    case 'ADD_PACKET':
      return Object.assign({}, state, {packet: [...state.packets, action.packet]});

    case 'ADD_SOCKET':
      let sockets = Object.assign({}, state.sockets);
      sockets[action.socket.nsp] = action.socket;
      return Object.assign({}, state, {sockets: sockets});

    case 'SET_IO_DETECTED':
      return Object.assign({}, state, {isIoDetected: true});

    default: return state;
  }
}

export default updates;