import React, { PropTypes } from 'react'

class PacketContent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <pre>{this.props.data}</pre>
      </div>
    )
  }
}

PacketContent.propTypes = {
  data: PropTypes.any.isRequired
}

export default PacketContent
