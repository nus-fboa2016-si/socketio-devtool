'use strict';
var Emitter = require('component-emitter');
var inject = require('./inject');

var messenger = {};
Emitter(messenger);
//connect to background.js with name 'devtool-page'
var backgroundPageConnection = chrome.runtime.connect({
  name: "devtool-page"
});

var Emitter = require('component-emitter');
var messenger = {};
Emitter(messenger);

backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

inject(chrome.runtime.getURL('dist/checkForIO.js'));