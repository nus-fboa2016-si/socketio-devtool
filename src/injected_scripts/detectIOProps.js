(function(){

	console.log('running');
  var io = window.io;
  console.log(io.managers);
  for(manager in io.managers){
    if(io.managers.hasOwnProperty(manager)) {
      console.log(manager);
      window.postMessage({type: 'socketiodev', data: {type: 'manager', message: manager}}, '*');
      io.managers[manager].engine.on('packetCreate', function(msg){
        window.postMessage({type: 'socketiodev', data: {type: 'packetCreate', manager: manager, message: msg}}, '*');
      })
      io.managers[manager].engine.on('data', function(msg){
        window.postMessage({type: 'socketiodev', data: {type: 'packetRcv', manager: manager, message: msg}}, '*');
      });
      console.log('taking sockets');
      var sockets = io.managers[manager].nsps;
      for(skt in sockets){
        console.log('skt', skt);
        if(sockets.hasOwnProperty(skt)){
          console.log('posting');
          window.postMessage({type: 'socketiodev', data: {type: 'socket', manager: manager, message: skt}}, '*');
        }
      }
    }
  }

})();