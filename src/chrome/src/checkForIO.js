function run(){
  if(window.io) {
    //global io detected.
    window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'connect', message: 'io-global'}}, '*');
    attachHooks();
  }else{
    window.postMessage({type: '__SOCKETIO_DEVTOOL__', data:{type: 'connect', message:'no-io'}}, '*');
    window.setTimeout(run, 2000);
  }
}

var engineIds = {};

function attachHooks(){
 var managers = window.io.managers;
  for(var manager in managers){
    if(managers.hasOwnProperty(manager) && !engineIds[managers[manager].engine.id]){
      var eid = managers[manager].engine.id;
      engineIds[eid] = managers[manager];
      console.log(managers[manager]);
      managers[manager].engine.on('packetCreate', function(msg){
        window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'packetCreate', url: manager, data: msg.data, timestamp: Date.now() }}, '*');
      });
      managers[manager].engine.on('data', function(msg){
        window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'packetRcv', url: manager, data: msg, timestamp: Date.now() }}, '*');
      });
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

run();
