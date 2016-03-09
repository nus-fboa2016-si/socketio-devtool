/*
 * action types
 */
export const ADD_PACKET = 'ADD_PACKET'
export const DISPLAY_PACKET_CONTENT = 'DISPLAY_PACKET_CONTENT'

export function addPacket(packet) {
  return { type: ADD_PACKET, packet }
}

export function displayPacketContent(id) {
  return { type: DISPLAY_PACKET_CONTENT, id }
}
