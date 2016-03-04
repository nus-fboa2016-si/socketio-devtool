window.addEventListener('message', function(event) {
  if (event.source != window || !event.data) return;
  var message = event.data;
  console.log(message);
  if(event.data.type == '__SOCKETIO_DEVTOOL__') {
    chrome.runtime.sendMessage(message.data);
  }
});

