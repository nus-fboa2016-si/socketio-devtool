
(function(){
  console.log('run');
  if(window.io){
    window.postMessage({type: 'socketiodev', data: {type: 'connect', message:'io-global'}}, '*');

  }else{
    window.postMessage({type: 'socketiodev', data:{type: 'connect', message:'no-io'}}, '*');
    window.setTimeout(run, 5000);
  }
})();
