var attachHooks = function(manager, mgrUrl){

  var hasDevtoolPktCreateListener = false;
  if(manager.engine._callbacks.packetCreate) {
    for (var listener in manager.engine._callbacks.packetCreate) {
      if(manager.engine._callbacks.packetCreate[listener].name.includes('__siDevtoolPktCreateListener__')) {
        hasDevtoolPktCreateListener = true;
      }
    }
  }
  if (!hasDevtoolPktCreateListener) {
    var __siDevtoolPktCreateListener__ = function (mgr, mgrUrl,  msg) {
      if(msg === undefined) return;
      window.postMessage({
        type: '__SOCKETIO_DEVTOOL__',
        data: {type: 'packetCreate', url: mgrUrl, data: msg.data, timestamp: Date.now(), sid: mgr.engine.id}
      }, '*');
    };
    manager.engine.on('packetCreate', __siDevtoolPktCreateListener__.bind(this, manager, mgrUrl));
  }

  var hasDevtoolPktRcvListener = false;
  if(manager.engine._callbacks.data) {
    for (var listener in manager.engine._callbacks.data) {
      if (manager.engine._callbacks.data[listener].name.includes('__siDevtoolPktRcvListener__')) {
        hasDevtoolPktRcvListener = true;
      }
    }
  }
  if(!hasDevtoolPktRcvListener){
    var __siDevtoolPktRcvListener__ = function(mgr, mgrUrl, msg){
      window.postMessage({
        type: '__SOCKETIO_DEVTOOL__',
        data: {type: 'packetRcv', url: mgrUrl, data: msg, timestamp: Date.now(), sid: mgr.engine.id}
      }, '*');
    };
    manager.engine.on('data', __siDevtoolPktRcvListener__.bind(this, manager, mgrUrl));
  }


  //listen to pong packets
  var __siDevtoolPongListener__ = function(mgr, mgrUrl, pongPkt){
    window.postMessage({type: '__SOCKETIO_DEVTOOL__',
      data: {type: 'pong', url: mgrUrl, data: pongPkt},
      id: mgr.engine.id}, '*');
  }
  if(!manager._callbacks.$pong){
    manager.on('pong', __siDevtoolPongListener__.bind(this, manager, mgrUrl));
  }

  var __siDevtoolCloseListener__ = function(mgr, mgrUrl){
    window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'forcedClose', url: mgrUrl, sid: mgr.engine.id}}, '*');
  };
  var hasCloseListener = false;
  for(var listener in manager._callbacks.$close){
    if(manager._callbacks.$close[listener].name.includes('__siDevtoolCloseListener__')){
      hasCloseListener = true;
    }
  }
  if(!hasCloseListener){
    manager.on('close', __siDevtoolCloseListener__.bind(this, manager, mgrUrl));
  }

  var sockets = manager.nsps;
  for(var skt in sockets) {
    if (sockets.hasOwnProperty(skt)) {
      window.postMessage({
        type: '__SOCKETIO_DEVTOOL__',
        data: {type: 'socket', url: mgrUrl, socket: skt, status: sockets[skt].connected ? 'CONNECTED' : 'CLOSED',  sid: manager.engine.id}
      }, '*');
    }
  }
};

module.exports = attachHooks;