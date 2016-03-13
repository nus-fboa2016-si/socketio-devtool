import React from 'react'

class PacketMetaData extends React.Component {
	render() {
		return (
			<div>
				<div>
					Packet Type: <span>User Event</span>
				</div>
				<div>
					Received: <span>3m 2s ago</span>
				</div>
			</div>
		)
	}
}

export default PacketMetaData