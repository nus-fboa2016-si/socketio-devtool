
//connect to background.js with name 'devtool-page'
var backgroundPageConnection = chrome.runtime.connect({
  name: "devtool-page"
});

var Emitter = require('component-emitter');
var messenger = {};
Emitter(messenger);


//tells background.js which tab is connected to this devtool page,
//so it can route the messages correctly
backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

//get the script to inject to inspected page and inject it via eval().
var xhr = new XMLHttpRequest();
xhr.open('GET', chrome.extension.getURL('../../injected_scripts/detectIO.js'), false);
xhr.send();
var script = xhr.responseText;
chrome.devtools.inspectedWindow.eval(script);


//listen to whether socket.io is running on inspected page.
backgroundPageConnection.onMessage.addListener(function(message) {
  //console.log('msssgg:', message);
  try {
    switch (message.type) {
      case 'connect':
        handleConnect(message.message);
        break;
      case 'manager':
        handleManager(message.message);
        break;
      case 'socket':
        handleSocket({manager: message.manager, message: message.message});
        break;
      case 'packetCreate':
        handlePacketCreate({manager: message.manager, message: message.message});
        break;
      case 'packetRcv':
        handlePacketRcv({manager: message.manager, message: message.message});
        break;
      default:
        break;
    }
  } catch (e) {
   console.log(e);
  }
});

var handleConnect =  function(data) {
  if(data == 'no-io'){
    //do no-io
    messenger.emit('io', 'no-io');
  }else if(data == 'io-global'){
    //io is global
    messenger.emit('io', 'global-io');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('/dist/src/injected_scripts/detectIOProps.js'), false);
    xhr.send();
    var script = xhr.responseText;
    chrome.devtools.inspectedWindow.eval(script);
  }
};

var handleManager = function(data){
  messenger.emit('manager', data);
  console.log('manager detected:' + data);
};
var handleSocket = function(data){
  messenger.emit('socket', data);
};

var handlePacketCreate = function(data){
  data.timestamp = Date.now();
  //console.log('packetcreate:', data);
  messenger.emit('packetCreate', data);

};
var handlePacketRcv = function(data){
  data.timestamp = Date.now();
  //console.log('packetrcv:', data);
  messenger.emit('packetRcv', data);
};


window.messenger = messenger;
