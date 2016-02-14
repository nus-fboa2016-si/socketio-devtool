(function(){

	console.log('running');
  var io = window.io;
  console.log(io.managers);
  for(manager in io.managers){
    if(io.managers.hasOwnProperty(manager)) {
      console.log(manager);
      window.postMessage({type: 'socketiodev', data: {type: 'manager', message: manager}}, '*');
    }
  }

})();