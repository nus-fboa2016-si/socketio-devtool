
var openCount = 0;
var connections = {};
var pollCount = function(){
  console.log('open:', openCount);
  window.setTimeout(pollCount, 5000);
};
pollCount();
//listen to connection from devtool page.
chrome.runtime.onConnect.addListener(function (port) {
  openCount++;
  var extensionListener = function(message, sender, sendResponse){
    if(message.name == 'init'){
      connections[message.tabId] = port;
      console.log('init', port);
    }
  };

  //listen to messages from messages from devtool pages
  port.onMessage.addListener(extensionListener);
  port.onDisconnect.addListener(function(port){
    port.onMessage.removeListener(extensionListener);
    openCount--;
    for (tab in connections){
      if(connections[tab] == port){
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