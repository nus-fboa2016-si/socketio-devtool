var Emitter = require('component-emitter');
var messenger = {};
var logger = {};
Emitter(messenger);
Emitter(logger);

//connect to background.js with name 'devtool-page'
var backgroundPageConnection = chrome.runtime.connect({
  name: "devtool-page"
});

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
  try {
    backgroundPageConnection.postMessage({
      name: 'log',
      message: message
    });
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
    backgroundPageConnection.postMessage({
      name: 'error',
      message: e
    });
    document.getElementById('hello').innerText = 'error';
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
  backgroundPageConnection.postMessage({
    name: 'log',
    message: 'Manager detected: ' + data
  });
};
var handleSocket = function(data){
  messenger.emit('socket', data);
};

var handlePacketCreate = function(data){
  messenger.emit('packetCreate', data);
  backgroundPageConnection.postMessage({
    name: 'log',
    message: 'packet By: ' + data.manager + ', data: ' + data.message
  });
};
var handlePacketRcv = function(data){
  messenger.emit('packetRcv', data);
  backgroundPageConnection.postMessage({
    name: 'log',
    message: 'packet from: ' + data.manager + ', data: ' + data.message
  });
};

logger.on('log', function(msg){
  backgroundPageConnection.postMessage({
    name: 'log',
    message: msg
  });
});
window.messenger = messenger;

window.logger = logger;