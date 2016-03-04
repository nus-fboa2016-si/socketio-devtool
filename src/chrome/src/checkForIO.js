function run(){
  if(window.io) {
    //global io detected.
    window.postMessage({type: 'socketiodev', data: {type: 'connect', message: 'io-global'}}, '*');
    attachHooks();
  }else{
    window.postMessage({type: 'socketiodev', data:{type: 'connect', message:'no-io'}}, '*');
    window.setTimeout(run, 5000);
  }
}

var engineIds = {};

function attachHooks(){
 var managers = window.io.managers;
  for(manager in managers){
    if(managers.hasOwnProperty(manager) && !engineIds[managers[manager].engine.id]){
      var eid = managers[manager].engine.id;
    }
  }
}

run();
