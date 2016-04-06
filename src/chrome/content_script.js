var content_script_start = function() {
  console.log('start contentScript');
  var socketIOEventListener = function (event) {
    if (event.source != window || !event.data) return;
    var message = event.data;
    if (event.data.type == '__SOCKETIO_DEVTOOL__') {
       if(message.data.data && (isBuf(message.data.data) || message.data.data.base64)){
         message.data.data = btoa(Uint8ToString(new Uint8Array(message.data.data)));
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

var Uint8ToString = function(u8a){
  var CHUNK_SZ = 0x8000;
  var c = [];
  for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
  }
  return c.join("");
}