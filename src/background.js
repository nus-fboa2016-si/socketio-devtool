
var openCount = 0;
var connections = {};

//listen to connection from devtool page.
chrome.runtime.onConnect.addListener(function (port) {
  var extensionListener = function(message, sender, sendResponse){
    if(message.name == 'init'){
      connections[message.tabId] = port;
      //alert('tab sent' + message.tabId + port.name);
    }else if(message.name == 'log'){
      console.log('LOG: ', message);
      //alert('message ' + message.msg);
      //chrome.tabs.executeScript(message.tabId, {file: message.script});
    }else if(message.name == 'error'){
      console.error(message.message);
    }
  };

  //listen to messages from messages from devtool pages
  port.onMessage.addListener(extensionListener);
  port.onDisconnect.addListener(function(port){
    port.onmessage.removeListener(extensionListener);

    for (tab in connections){
      if(connections[tab] == port){
        alert('tab broken');
        delete connections[tab];
        break;
      }
    }
  });
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Messages from content scripts should have sender.tab set
  //alert('message:');
  if (sender.tab) {
    var tabId = sender.tab.id;
    if (tabId in connections) {
      connections[tabId].postMessage(request);
    } else {
      console.log("Tab not found in connection list.");
    }
  } else {
    console.log("sender.tab not defined.");
  }
  return true;
});