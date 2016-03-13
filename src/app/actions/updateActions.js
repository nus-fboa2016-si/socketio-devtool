export function addSocket(socket){
  return {
    type: 'ADD_SOCKET',
    socket: socket
  }
}

export function addPacket(packet){
  return {
    type: 'ADD_PACKET',
    packet: packet
  }
}