
var attachHooks = require('./AttachHooks');
function attach(){
 var managers = window.io.managers;
  for(var manager in managers){
    if(managers.hasOwnProperty(manager)) {
      attachHooks(managers[manager], manager);
    }
  }
  window.setTimeout(attach, 2000);
}

var run = function() {
  if (window.io) {
//global io detected.
    window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'connect', message: 'io-global'}}, '*');
    attach();
  } else {
    window.postMessage({type: '__SOCKETIO_DEVTOOL__', data: {type: 'connect', message: 'no-io'}}, '*');
    window.setTimeout(run, 2000);
  }
};


run();