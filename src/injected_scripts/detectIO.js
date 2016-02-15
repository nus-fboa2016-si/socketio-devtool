
(function(){
  console.log('run');
  if(window.io){
    //TODO: try short-circuiting the message passing process but directly invoking chrome.devtools.sendMessage
    window.postMessage({type: 'socketiodev', data: {type: 'connect', message:'io-global'}}, '*');

  }else{
    window.postMessage({type: 'socketiodev', data:{type: 'connect', message:'no-io'}}, '*');
    window.setTimeout(run, 5000);
  }
})();
