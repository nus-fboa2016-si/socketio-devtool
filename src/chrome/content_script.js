var content_script_start = function() {
  console.log('start contentScript');
  var socketIOEventListener = function (event) {
    if (event.source != window || !event.data) return;
    var message = event.data;
    if (event.data.type == '__SOCKETIO_DEVTOOL__') {
       if(message.data.data && (isBuf(message.data.data) || message.data.data.base64)){
         data = {
           data: new Uint8Array(message.data.data),
           contentType: 'Uint8Array'
         };
         message.data.data = JSON.stringify(data);
         message.data.isBin = true;
       }
      // console.log('si msg', message.data);
      chrome.runtime.sendMessage(message.data);
    }
  };
  window.addEventListener('message', socketIOEventListener);
};

content_script_start();

//method taken from socket.io-parser
var isBuf = function(obj) {
  return (window.Buffer && window.Buffer.isBuffer(obj)) ||
    (window.ArrayBuffer && obj instanceof ArrayBuffer);
};
