var content_script_start = function() {
  console.log('start contentScript');
  var socketIOEventListener = function (event) {
    if (event.source != window || !event.data) return;
    var message = event.data;
    //console.log('si msg', message.data);
    if (event.data.type == '__SOCKETIO_DEVTOOL__') {
      chrome.runtime.sendMessage(message.data);
    }
  };
  window.addEventListener('message', socketIOEventListener);
};

content_script_start();

