export function selectSocket(socket){
  return {
    type: 'SELECT_SOCKET',
    socket: socket
  }
}

export function selectPacket(packet) {
	return {
		type: 'SELECT_PACKET',
		packet: packet
	}
}