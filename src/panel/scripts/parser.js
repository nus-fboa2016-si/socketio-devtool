var siParser = require('socket.io-parser');

var decodingQueue = [];

var Parser = function(){
  if(!(this instanceof Parser)) return new Parser();
  this.decoder = new siParser.Decoder();
  return this;
};

Parser.prototype.decode= function(packet, fn){
  if('string' == typeof packet.message){
    this.handleMessageDecode(packet, true, fn);
    return;
  }
  switch(packet.message.type){
    case 'message': this.handleMessageDecode(packet, false, fn); break;

    case 'ping':    if(fn) fn(packet.manager, {type: 'ping'});
                    break;

  }
};


Parser.prototype.handleMessageDecode = function(packet, isReceivedPkt, fn){
  var decoderListen = function(manager, callback, decodedPkt){
    if(callback) callback(manager, decodedPkt);
    this.decoder.removeListener('decoded', decoderListen);
    if(decodingQueue.length !== 0){
      var nextJob = decodingQueue.shift();
      this.decoder.on('decoded', decoderListen.bind(this, nextJob.manager, nextJob.callback));
      this.decoder.add(nextJob.packet);
    }
  }.bind(this, packet.manager, fn);
  if (!this.decoder._callbacks || !this.decoder._callbacks['decoded'] || this.decoder._callbacks['decoded'].length === 0){
    this.decoder.on('decoded', decoderListen);
    this.decoder.add(isReceivedPkt ? packet.message : packet.message.data);
  }else{
    decodingQueue.push({manager: packet.manager, packet: isReceivedPkt ? packet.message : packet.message.data, callback: fn});
  }

};


window.parser = Parser();