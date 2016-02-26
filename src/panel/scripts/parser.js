var siParser = require('socket.io-parser');


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
  var decoderListen = function(decodedPkt){
    if(fn) fn(packet.manager, decodedPkt);
    this.decoder.removeListener('decoded', decoderListen);
  }.bind(this);
  //console.log('packet', packet);
  this.decoder.on('decoded', decoderListen);
  this.decoder.add(isReceivedPkt ? packet.message : packet.message.data);
};


window.parser = Parser();