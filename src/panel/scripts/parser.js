var siParser = require('socket.io-parser');



var Parser = function(){
  if(!(this instanceof Parser)) return new Parser();
  this.decoder = new siParser.Decoder();
  return this;
};

Parser.prototype.decode= function(packet, fn){
  switch(packet.message.type){
    case 'message': this.handleMessageDecode(packet, fn); break;

    case 'ping':    if(fn) fn(packet.manager, {type: 'ping'});
                    break;
  }
};

Parser.prototype.handleMessageDecode = function(packet, fn){
  var decoderListen = function(decodedPkt){
    if(fn) fn(packet.manager, decodedPkt);
    this.decoder.removeListener('decoded', decoderListen);
  }.bind(this);

  this.decoder.on('decoded', decoderListen);
  this.decoder.add(packet.message.data);

};
window.parser = Parser();