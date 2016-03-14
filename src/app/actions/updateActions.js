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

export function setIoDetected(){
  return {
    type: 'SET_IO_DETECTED'
  }
}