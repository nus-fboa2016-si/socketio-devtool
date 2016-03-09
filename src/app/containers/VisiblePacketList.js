import { connect } from 'react-redux'
import { displayPacketContent } from '../actions/action'
import PacketList from '../components/PacketList'

const mapStateToProps = (state) => {
  return {
    packets: state.packets
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPacketClick: (id) => {
      dispatch(displayPacketContent(id))
    }
  }
}

const VisiblePacketList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PacketList)

export default VisiblePacketList