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
        var packet = {
          url: url,
          type: data.type,
          nsp: data.nsp,
          data: data.data,
          timestamp: timestamp
        };
        messenger.emit('packetCreate', packet);

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
        var packet = {
          url: url,
          type: data.type,
          nsp: data.nsp,
          data: data.data,
          timestamp: timestamp
        };
        messenger.emit('packetRcv', packet);

      }.bind(this, packet.url, packet.timestamp));

    } catch (e) {
      console.error(e);
    }
  };

  var handlePageRefresh = function(){
    inject(chrome.runtime.getURL('dist/checkForIO.js'));
    messenger.emit('reinit');
  };

  inject(chrome.runtime.getURL('dist/checkForIO.js'));
};


export default messenger;
