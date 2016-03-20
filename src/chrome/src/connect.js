'use strict';
var Emitter = require('component-emitter');
var inject = require('./inject');
var Parser = require('./parser');


var messenger = {};
Emitter(messenger);
//connect to background.js with name 'devtool-page'

var Emitter = require('component-emitter');
var messenger = {};
Emitter(messenger);
messenger.run = function() {
  var backgroundPageConnection = chrome.runtime.connect({
    name: "devtool-page"
  });
  backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
  });

  backgroundPageConnection.onMessage.addListener(function (message) {
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
      case 'close':
        handleForcedClose(message);
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
    var socket = {
      url: data.url,
      nsp: data.socket,
      timestamp: Date.now(),
      status: 'CONNECTED'
    };
    messenger.emit('socket', socket);
  };

  var handlePacketCreate = function (packet) {
    try {
      if (!packet.data) {
        //ping packet, ignore
        return;
      }
      Parser.decode(packet.data, function (url, timestamp, data) {

        console.log(url, timestamp, data);
        switch(data.type){
          case 1: messenger.emit('close', generateClosePacket(url, timestamp, data)); break;
          case 2: messenger.emit('packetCreate', generateContentPacket(url, timestamp, data)); break;
          default:
            return;
        }

      }.bind(this, packet.url, packet.timestamp));

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
      Parser.decode(packet.data, function (url, timestamp, data) {
        switch(data.type){
          case 0: messenger.emit('socket', generateNewSocketPacket(url, timestamp, data)); break;
          case 1: messenger.emit('close', generateClosePacket(url, timestamp, data)); break;
          case 2: messenger.emit('packetRcv', generateContentPacket(url, timestamp, data));
          default: return;
        }

      }.bind(this, packet.url, packet.timestamp));

    } catch (e) {
      console.error(e);
    }
  };

  var handlePongPacket = function(pongPkt){
    messenger.emit('pong', pongPkt);
  };

  var handleForcedClose = function(packet){

  };


  var handlePageRefresh = function(){
    inject(chrome.runtime.getURL('dist/checkForIO.js'));
    messenger.emit('reinit');
  };

  inject(chrome.runtime.getURL('dist/checkForIO.js'));
};

var generateNewSocketPacket = function(url, timestamp, data){
  var socket = {
    url: data.url ? data.url: url,
    nsp: data.socket ? data.socket : data.nsp,
    timestamp: timestamp ? timestamp : Date.now(),
    status: 'CONNECTED'
  };
  return socket;
};
var generateContentPacket = function(url, timestamp, data) {
  var packet = {
    url: url,
    type: data.type,
    nsp: data.nsp,
    data: data.data,
    timestamp: timestamp
  };
  return packet;
};

var generateClosePacket = function(url, timestamp, data){
  var packet = {
    url: url,
    timestamp: timestamp,
    nsp: data.nsp
  };
  return packet
};

export default messenger;
