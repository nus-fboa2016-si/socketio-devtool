
function run(){
  console.log('run');
  if(window.io){
    //TODO: try short-circuiting the message passing process but directly invoking chrome.devtools.sendMessage
    window.postMessage({type: 'socketiodev', data: 'io-global'}, '*');
  }else{
    window.postMessage({type: 'socketiodev', data: 'no-io'}, '*');
    window.setTimeout(run, 5000);
  }
}

run();