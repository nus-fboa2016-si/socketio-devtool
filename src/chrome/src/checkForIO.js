

var engineIds = {};

function attachHooks(){
 var managers = window.io.managers;
  for(var manager in managers){
    if(managers.hasOwnProperty(manager)) {
      var engine = managers[manager].engine;
      var eid = engine.id;
      engineIds[eid] = managers[manager];
      console.log(managers[manager]);
      
      var hasDevtoolPktCreateListener = false;
      if(engine._callbacks.packetCreate) {
        for (var listener in engine._callbacks.packetCreate) {
          if(engine._callbacks.packetCreate[listener].name.includes('__siDevtoolPktCreateListener__')) {
            hasDevtoolPktCreateListener = true;
          }
        }
      }
      if (!hasDevtoolPktCreateListener) {
        var __siDevtoolPktCreateListener__ = function (manager, managers, msg) {
          if(msg === undefined) return;
          window.postMessage({
            type: '__SOCKETIO_DEVTOOL__',
            data: {type: 'packetCreate', url: manager, data: msg.data, timestamp: Date.now(), sid: managers[manager].engine.id}
          }, '*');
        };
        //console.log('managersPacketCreate');
        managers[manager].engine.on('packetCreate', __siDevtoolPktCreateListener__.bind(this, manager, managers));
      }

      var hasDevtoolPktRcvListener = false;
      if(engine._callbacks.data) {
        for (var listener in engine._callbacks.data) {
          if (engine._callbacks.data[listener].name.includes('__siDevtoolPktRcvListener__')) {
            hasDevtoolPktRcvListener = true;
          }
        }
      }
      if(!hasDevtoolPktRcvListener){
        var __siDevtoolPktRcvListener__ = function(manager, managers, msg){
          window.postMessage({
            type: '__SOCKETIO_DEVTOOL__',
            data: {type: 'packetRcv', url: manager, data: msg, timestamp: Date.now(), sid: managers[manager].engine.id}
          }, '*');
        };
        //console.log('managersPacketRcv');
        managers[manager].engine.on('data', __siDevtoolPktRcvListener__.bind(this, manager, managers));
      }


      //listen to pong packets
      var __siDevtoolPongListener__ = function(manager, managers, pongPkt){
        window.postMessage({type: '__SOCKETIO_DEVTOOL__',
          data: {type: 'pong', url: manager, data: pongPkt},
          id: managers[manager].engine.id}, '*');
      }
      if(!managers[manager]._callbacks.$pong){
        managers[manager].on('pong', __siDevtoolPongListener__.bind(this, manager, managers));
      }

      var __siDevtoolCloseListener__ = function(manager, managers){
        window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'forcedClose', url: manager, sid: managers[manager].engine.id}}, '*');
      }
      var hasCloseListener = false;
      for(var listener in managers[manager]._callbacks.$close){
        if(io.managers[manager]._callbacks.$close[listener].name.includes('__siDevtoolCloseListener__')){
          hasCloseListener = true;
        }
      }
      if(!hasCloseListener){
        managers[manager].on('close', __siDevtoolCloseListener__.bind(this, manager, managers));
      }

      var sockets = managers[manager].nsps;
      for(var skt in sockets) {
        if (sockets.hasOwnProperty(skt)) {
          window.postMessage({
            type: '__SOCKETIO_DEVTOOL__',
            data: {type: 'socket', url: manager, socket: skt, status: sockets[skt].connected ? 'CONNECTED' : 'CLOSED',  sid: managers[manager].engine.id}
          }, '*');
        }
      }
    }
  }
  window.setTimeout(attachHooks, 2000);
}
var run = function() {
  if (window.io) {
//global io detected.
    window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'connect', message: 'io-global'}}, '*');
    attachHooks();
  } else {
    window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'connect', message: 'no-io'}}, '*');
    window.setTimeout(run, 2000);
  }
}

run();