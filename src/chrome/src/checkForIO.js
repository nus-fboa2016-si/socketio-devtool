

var engineIds = {};

function attachHooks(){
 var managers = window.io.managers;
  for(var manager in managers){
    if(managers.hasOwnProperty(manager) && !engineIds[managers[manager].engine.id]) {
      var engine = managers[manager].engine;
      var eid = engine.id;
      engineIds[eid] = managers[manager];
      console.log(managers[manager]);
      
      var hasDevtoolPktCreateListener = false;
      if(engine._callbacks.packetCreate) {
        for (var listener in engine._callbacks.packetCreate) {
          if('__siDevtoolPktCreateListener__' === engine._callbacks.packetCreate[listener].name) {
            hasDevtoolPktCreateListener = true;
          }
        }
      }
      if (!hasDevtoolPktCreateListener) {
        var __siDevtoolPktCreateListener__ = function (msg) {
          if(msg === undefined) return;
          window.postMessage({
            type: '__SOCKETIO_DEVTOOL__',
            data: {type: 'packetCreate', url: manager, data: msg.data, timestamp: Date.now()}
          }, '*');
        };
        //console.log('managersPacketCreate');
        managers[manager].engine.on('packetCreate', __siDevtoolPktCreateListener__);
      }

      var hasDevtoolPktRcvListener = false;
      if(engine._callbacks.data) {
        for (var listener in engine._callbacks.data) {
          if ('__siDevtoolPktRcvListener__' === engine._callbacks.data[listener].name) {
            hasDevtoolPktRcvListener = true;
          }
        }
      }
      if(!hasDevtoolPktRcvListener){
        var __siDevtoolPktRcvListener__ = function(msg){
          window.postMessage({
            type: '__SOCKETIO_DEVTOOL__',
            data: {type: 'packetRcv', url: manager, data: msg, timestamp: Date.now() }
          }, '*');
        };
        //console.log('managersPacketRcv');
        managers[manager].engine.on('data', __siDevtoolPktRcvListener__);
      }


      //listen to pong packets
      var __siDevtoolPongListener__ = function(pongPkt){
        window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'pong', url: manager, data: pongPkt}}, '*');
      }
      if(!managers[manager]._callbacks.$pong){
        managers[manager].on('pong', __siDevtoolPongListener__);
      }


      var sockets = io.managers[manager].nsps;
      for(var skt in sockets) {
        if (sockets.hasOwnProperty(skt)) {
          window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'socket', url: manager, socket: skt}}, '*');
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