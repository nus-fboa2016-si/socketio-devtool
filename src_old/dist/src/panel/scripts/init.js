(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(require,module,exports){

//connect to background.js with name 'devtool-page'
var backgroundPageConnection = chrome.runtime.connect({
  name: "devtool-page"
});

var Emitter = require('component-emitter');
var messenger = {};
Emitter(messenger);

//tells background.js which tab is connected to this devtool page,
//so it can route the messages correctly
backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

var injectDetectionScript = function() {
//get the script to inject to inspected page and inject it via eval().
  var xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.extension.getURL('../../injected_scripts/detectIO.js'), false);
  xhr.send();
  var script = xhr.responseText;
  chrome.devtools.inspectedWindow.eval(script);
};

injectDetectionScript();

//listen to whether socket.io is running on inspected page.
backgroundPageConnection.onMessage.addListener(function(message) {
  //console.log('msssgg:', message);
  try {
    switch (message.type) {
      case 'connect':
        handleConnect(message.message);
        break;
      case 'manager':
        handleManager(message.message);
        break;
      case 'socket':
        handleSocket({manager: message.manager, message: message.message});
        break;
      case 'packetCreate':
        handlePacketCreate({manager: message.manager, message: message.message});
        break;
      case 'packetRcv':
        handlePacketRcv({manager: message.manager, message: message.message});
        break;
      case 'pageRefresh':
        handlePageRefresh();
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(err);
  }
});

var handlePageRefresh = function(){
  injectDetectionScript();
  messenger.emit('init');
};

var handleConnect =  function(data) {
  if(data == 'no-io'){
    //do no-io
    messenger.emit('io', 'no-io');
  }else if(data == 'io-global'){
    //io is global
    messenger.emit('io', 'global-io');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('/dist/src/injected_scripts/detectIOProps.js'), false);
    xhr.send();
    var script = xhr.responseText;
    chrome.devtools.inspectedWindow.eval(script);
  }
};


var handleManager = function(data){
  messenger.emit('manager', data);
  console.log('manager detected:' + data);
};
var handleSocket = function(data){
  messenger.emit('socket', data);
};

var handlePacketCreate = function(data){
  data.timestamp = Date.now();
  //console.log('packetcreate:', data);
  messenger.emit('packetCreate', data);

};
var handlePacketRcv = function(data){
  data.timestamp = Date.now();
  //console.log('packetrcv:', data);
  messenger.emit('packetRcv', data);
};


window.messenger = messenger;

},{"component-emitter":1}]},{},[2]);
