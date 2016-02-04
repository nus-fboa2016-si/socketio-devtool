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
xhr.open('GET', chrome.extension.getURL('/inject.js'), false);
xhr.send();
var script = xhr.responseText;
chrome.devtools.inspectedWindow.eval(script);


//listen to whether socket.io is running on inspected page.
backgroundPageConnection.onMessage.addListener(function(message){
  if(message.data == 'no-io'){
    //do no-io
    document.getElementById('hello').innerText = 'no io detected';
  }else if(message.data == 'io-global'){
    //io is global
    document.getElementById('hello').innerText = 'global IO detected';
  }
});
