export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const packetTypes = ['CONNECT', 'DISCONNECT', 'EVENT', 'ACK', 'ERROR', 'BINARY_EVENT', 'BINARY_ACK'];

export function getPacketType(type) {
	return packetTypes[type];
}

export function stringToColorCode(str) {
	let hash = 0;
  for (var i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "00000".substring(0, 6 - color.length) + color;
}