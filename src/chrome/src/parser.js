var siParser = require('socket.io-parser');

var decodingQueue = [];

var Parser = function(){
  if(!(this instanceof Parser)) return new Parser();
  this.decoder = new siParser.Decoder();
  return this;
};

Parser.prototype.decode= function(packet, fn){
  var decoderListen = function(callback, decodedPkt){
    if(callback) callback(decodedPkt);
    this.decoder.removeListener('decoded', decoderListen);
    if(decodingQueue.length !== 0){
      var nextJob = decodingQueue.shift();
      this.decoder.on('decoded', decoderListen.bind(this, nextJob.callback));
      this.decoder.add(nextJob.packet);
    }
  }.bind(this, fn);
  if (!this.decoder._callbacks || !this.decoder._callbacks['decoded'] || this.decoder._callbacks['decoded'].length === 0){
    this.decoder.on('decoded', decoderListen);
    this.decoder.add(packet);
  }else{
    decodingQueue.push({packet: packet, callback: fn});
  }

};




module.exports = Parser();