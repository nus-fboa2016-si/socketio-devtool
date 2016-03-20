export function addSocket(socket) {
  return {
    type: 'ADD_SOCKET',
    socket: socket
  }
}

export function addPacket(packet) {
  return {
    type: 'ADD_PACKET',
    packet: packet
  }
}

export function setIoDetected() {
  return {
    type: 'SET_IO_DETECTED'
  }
}

export function setKeyword(keyword) {
  return {
    type: 'SET_KEYWORD',
    keyword
  }
}

export function reinitialise() {
  return {
    type: 'REINITIALISE'
  }
}

export function timeTick() {
  return {
    type: 'TIMETICK'
  }
}

export function updateLatency(packet){
  return {
    type: 'UPDATE_LATENCY',
    packet: packet
  }
}