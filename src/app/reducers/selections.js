const initialState= {
  socketFilter: {},
  packetFilter: {}
};

function select(state=initialState, action){
  switch(action.type){
    case 'SELECT_SOCKET':
      return Object.assign({}, state, {socketFilter: action.socket});
    case 'REINITIALISE':
      console.log("REINITIALISE");
      return initialState;

    default: return state;
  }
}

export default select;