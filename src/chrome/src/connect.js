'use strict';
var Emitter = require('component-emitter');
var inject = require('./inject');
var Parser = require('./parser');


var messenger = {};
Emitter(messenger);

var packetRcvBuffer = [];
var packetCreateBuffer = [];
messenger.run = function() {
  var backgroundPageConnection = chrome.runtime.connect({
    name: "devtool-page"
  });
  backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
  });

  backgroundPageConnection.onMessage.addListener(function (message) {
    if(message.type==='packetCreate') console.log(message);
    switch (message.type) {
      case 'connect':
        handleConnect(message.message);
        break;
      case 'socket':
        handleSocket(message);
        break;
      case 'packetCreate':
        handlePacketCreate(message);
        break;
      case 'packetRcv':
        handlePacketRcv(message);
        break;
      case 'pong':
        handlePongPacket(message);
        break;
      case 'forcedClose':
        handleForcedClose(message);
        break;
      case 'pageRefresh':
        handlePageRefresh();
        break;
      default:
        break;
    }
  });

  var handleConnect = function (data) {
    if (data == 'no-io') {
      //do no-io
      messenger.emit('io', 'no-io');
    } else if (data == 'io-global') {
      //io is global
      messenger.emit('io', 'global-io');
    }
  };


  var handleSocket = function (data) {
    //console.log('handleSocket', data);
    if(data.status === 'CLOSED'){
      return;
    }
    var socket = {
      url: data.url,
      nsp: data.socket,
      timestamp: Date.now(),
      status: 'CONNECTED',
      sid: data.sid
    };
    messenger.emit('socket', socket);
  };

  var handlePacketCreate = function (packet) {
    try {
      if (!packet.data) {
        //ping packet, ignore
        return;
      }
      if(packet.isBin){
        var rcvData = JSON.parse(packet.data);
        packet.data = new Uint8Array(rcvData.data).buffer;
      }
      console.log('packet', packet);
      Parser.decode(packet.data, function (url, timestamp, sid, data) {

        console.log(url, timestamp, sid, data);
        switch(data.type){
          case 1: messenger.emit('close', generateClosePacket(url, timestamp, sid, data)); break;
          case 2: addToBuffer('create', generateContentPacket(url, timestamp, sid, data)); break;
          case 5: addToBuffer('create', generateContentPacket(url, timestamp, sid, data)); break;
          default:
            return;
        }

      }.bind(this, packet.url, packet.timestamp, packet.sid));

    } catch (e) {
      console.error(e);
    }

  };
  var handlePacketRcv = function (packet) {
    try {
      if (!packet.data) {
        //ping packet, ignore
        return;
      }
      if(packet.isBin){
        var rcvData = JSON.parse(packet.data);
        packet.data = new Uint8Array(rcvData.data).buffer;
      }
      Parser.decode(packet.data, function (url, timestamp, sid, data) {
        switch(data.type){
          case 0: messenger.emit('socket', generateNewSocketPacket(url, timestamp, sid, data)); break;
          case 1: messenger.emit('close', generateClosePacket(url, timestamp, sid, data)); break;
          case 2: addToBuffer('receive', generateContentPacket(url, timestamp, sid, data)); break;
          case 5: addToBuffer('receive', generateContentPacket(url, timestamp, sid, data)); break;
          default: return;
        }

      }.bind(this, packet.url, packet.timestamp, packet.sid));

    } catch (e) {
      console.error(e);
    }
  };

  var handlePongPacket = function(pongPkt){
    messenger.emit('pong', pongPkt);
  };

  var handleForcedClose = function(packet){
    messenger.emit('forcedClose', {url: packet.url, timestamp: Date.now()});
  };


  var handlePageRefresh = function(){
    inject(chrome.runtime.getURL('dist/checkForIO.js'));
    messenger.emit('reinit');
  };

  inject(chrome.runtime.getURL('dist/checkForIO.js'));

  timer();
};

var timer = function(){
  flushToApp();
  //16ms for 60fps.
  window.setTimeout(timer, 16);
};

var flushToApp = function(){
  if(packetCreateBuffer.length > 0){
    messenger.emit('packetCreate', packetCreateBuffer);
    packetCreateBuffer = [];
  }
  if(packetRcvBuffer.length > 0){
    messenger.emit('packetRcv', packetRcvBuffer);
    packetRcvBuffer = [];
  }
};

var addToBuffer = function(buffer, packet){
  if(buffer === 'create'){
    packetCreateBuffer.push(packet);
  }else{
    packetRcvBuffer.push(packet);
  }
}
var generateNewSocketPacket = function(url, timestamp, sid, data){
  var socket = {
    url: data.url ? data.url: url,
    nsp: data.socket ? data.socket : data.nsp,
    timestamp: timestamp ? timestamp : Date.now(),
    status: 'CONNECTED',
    sid: sid
  };
  return socket;
};
var generateContentPacket = function(url, timestamp, sid, data) {
  var packet = {
    url: url,
    type: data.type,
    nsp: data.nsp,
    data: data.data,
    timestamp: timestamp,
    sid: sid
  };
  return packet;
};

var generateClosePacket = function(url, timestamp, sid, data){
  var packet = {
    url: url,
    timestamp: timestamp,
    nsp: data.nsp,
    sid: sid
  };
  return packet
};

export default messenger;
