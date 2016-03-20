export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const PACKET_TYPES = ['CONNECT', 'DISCONNECT', 'EVENT', 'ACK', 'ERROR', 'BINARY_EVENT', 'BINARY_ACK'];

export function getPacketType(type) {
	return PACKET_TYPES[type];
}

export function stringToColorCode(str) {
	let hash = 0;
  for (var i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "00000".substring(0, 6 - color.length) + color;
}

export function colorLuminance(hex, lum) {
	let newColor = "#";
	for (var i = 0; i < 3; i++) {
		let c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		newColor += ("00"+c).substr(c.length);
	}

	return newColor;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
										 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SEC_IN_DAY = 86400;
const SEC_IN_HOUR = 3600;
const SEC_IN_MINUTE = 60;

export function dateFromNow(timestamp) {
	const difference = (Date.now() - timestamp) / 1000;
	if (difference >= SEC_IN_DAY) {
		const date = new Date(timestamp);
		return date.getDate() + ' ' +
					 MONTH_NAMES[date.getMonth()] + ' ' +
					 date.getYear() + ' ' +
					 date.getHours() + ':' + 
					 date.getMinutes() + ':' + 
					 date.getSeconds();
	} else {
		const hour = Math.floor(difference / SEC_IN_HOUR);
		const minute = Math.floor((difference - hour * SEC_IN_HOUR) / SEC_IN_MINUTE);
		const second = Math.floor(difference - hour * SEC_IN_HOUR - minute * SEC_IN_MINUTE);

		if (hour > 0 && minute == 0) {
			return hour + "h ago";
		} else if (hour > 0 && minute > 0) {
			return hour + "h " + minute + " m ago";
		} else if (hour == 0 && minute > 0 && second == 0) {
			return minute + "m ago";
		} else if (hour == 0 && minute > 0 && second > 0) {
			return minute + "m " + second + "s ago";
		} else if (hour == 0 && minute == 0 && second > 0) {
			return second + "s ago";
		} else if (hour == 0 && minute == 0 && second == 0) {
			return "just now";
		} 
	}
}