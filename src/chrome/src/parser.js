var siParser = require('socket.io-parser');
//isBuf taken from socket.io-parser
var isBuf = function(obj) {
  return (window.Buffer && window.Buffer.isBuffer(obj)) ||
    (window.ArrayBuffer && obj instanceof ArrayBuffer);
};
var decodingQueue = [];

var Parser = function(){
  if(!(this instanceof Parser)) return new Parser();
  this.decoder = new siParser.Decoder();
  return this;
};

Parser.prototype.decode= function(packet, fn){
  // console.log('parser,decode', typeof packet);
  // console.log(isBuf(packet));
  var decoderListen = function(callback, decodedPkt){
    // console.log('decoded', decodedPkt);
    if(callback) callback(decodedPkt);
    this.decoder.removeListener('decoded', decoderListen);
    if(decodingQueue.length !== 0){
      var nextJob = decodingQueue.shift();
      this.decoder.on('decoded', decoderListen.bind(this, nextJob.callback));
      this.decoder.add(nextJob.packet);
    }
  }.bind(this, fn);
  if (!this.decoder._callbacks || !this.decoder._callbacks['decoded'] || this.decoder._callbacks['decoded'].length === 0) {
    this.decoder.on('decoded', decoderListen);
    // console.log('adding');
    this.decoder.add(packet);

    //handle binary data events which can span multiple packets
  }else if(isBuf(packet) || packet.base64){
    // console.log('addingbuf');
    this.decoder.add(packet);
  }else{
    decodingQueue.push({packet: packet, callback: fn});
  }

};




module.exports = Parser();