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
      //console.log('addpacket', packet);
      packet['id'] = state.packetId;

      action.packet.from === 'received' ?
        sockets[getSktName(action.packet)].receivedCount++
        :
        sockets[getSktName(action.packet)].sentCount++;
      return Object.assign({}, state, {
        packets: [...state.packets, packet],
        sockets: sockets,
        packetId: state.packetId + 1
      });
    case 'ADD_PACKETS':
      sockets = Object.assign({}, state.sockets);
      let packets = action.packets.map(function(packet, i){
        packet.id = state.packetId + i;
        if(packet.from === 'received'){
          sockets[getSktName(packet)].receivedCount++;
        }else{
          sockets[getSktName(packet)].sentCount++;
        }
        return packet;
      });
      console.log('addpackets', packets);
      return Object.assign({}, state, {
        packets: [...state.packets, ...packets],
        sockets: sockets,
        packetId: state.packetId + packets.length
      });
    case 'ADD_SOCKET':
      //console.log('add socket');
      var sockets = Object.assign({}, state.sockets);
      var socket = sockets[getSktName(action.socket)];
      if (socket) {
        //console.log('non-null', socket);
        if (socket.status !== action.socket.status) {
          sockets[getSktName(action.socket)].status = action.socket.status;
          sockets[getSktName(action.socket)].receivedCount = 0;
          sockets[getSktName(action.socket)].sentCount = 0;
          sockets[getSktName(action.socket)].latency = -1;
        }
      } else {
        //console.log('null', socket);
        sockets[getSktName(action.socket)] = action.socket;
        sockets[getSktName(action.socket)].receivedCount = 0;
        sockets[getSktName(action.socket)].sentCount = 0;
        sockets[getSktName(action.socket)].latency = -1;
      }
      //console.log(' update sockets', sockets);
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
    case 'FORCED_CLOSE':
      return forcedClose(state, action.packet);
    case 'TIMETICK':
      return Object.assign({}, state, {currentTime: Date.now()});

    default: return state;

  }
}

var getSktName = function(packet){
  return packet.sid + packet.nsp;
}

var closeSocket = function(state, packet){
  var sockets = Object.assign({}, state.sockets);
  if(sockets.hasOwnProperty(packet.nsp)){
    sockets[packet.nsp].status = 'CLOSED';
    sockets[packet.nsp].timestamp = packet.timestamp;
  }
  return Object.assign({}, state, {sockets: sockets});
};

var forcedClose = function(state, packet){
  var sockets = Object.assign({}, state.sockets);
  //console.log(sockets, packet);
  for(var socket in sockets){
    if(sockets.hasOwnProperty(socket) && sockets[socket].url === packet.url){
      sockets[socket].status = 'CLOSED';
      sockets[socket].timestamp = packet.timestamp;
    }
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