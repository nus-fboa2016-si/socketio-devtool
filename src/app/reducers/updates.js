const initialState = {
  sockets: {},
  packets: [],
  packetId: 1,
  isIoDetected: false,
  keyword: '',
  currentTime: Date.now()
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
      var sockets = Object.assign({}, state.sockets);
      sockets[action.socket.nsp] = action.socket;
      sockets[action.socket.nsp].receivedCount = 0;
      sockets[action.socket.nsp].sentCount = 0;
      sockets[action.socket.nsp].latency = -1;
      return Object.assign({}, state, {sockets: sockets});

    case 'SET_KEYWORD':
      return Object.assign({}, state, {keyword: action.keyword});

    case 'SET_IO_DETECTED':
      return Object.assign({}, state, {isIoDetected: true});

    case 'REINITIALISE':
      return initialState;

    case 'UPDATE_LATENCY':
      return updateSocketLatency(state, action.packet);
    case 'CLOSE_SOCKET':
      return closeSocket(state, action.packet);
    case 'TIMETICK':
      return Object.assign({}, state, {currentTime: Date.now()});

    default: return state;

  }
}

var closeSocket = function(state, packet){
  var sockets = Object.assign({}, state.sockets);
  if(sockets.hasOwnProperty(packet.nsp)){
    sockets[packet.nsp].status = 'CLOSED';
    sockets[packet.nsp].timestamp = packet.timestamp;
  }
  return Object.assign({}, state, {sockets: sockets});
};

var updateSocketLatency = function(state, packet){
  var sockets = Object.assign({}, state.sockets);
  for(var socket in sockets){
    if(sockets.hasOwnProperty(socket) && sockets[socket].url === packet.url){
      sockets[socket].latency = packet.data;
    }
  }
  return Object.assign({}, state, {sockets: sockets});
};

export default updates;