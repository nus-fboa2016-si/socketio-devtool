(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
  var loggedManagers = {};
  var init = function() {
    //console.log('running');
    var io = window.io;
    //console.log(io.managers);
    for (manager in io.managers) {
      if (io.managers.hasOwnProperty(manager) && !loggedManagers[io.managers[manager].engine.id]) {
        loggedManagers[io.managers[manager].engine.id] = io.managers[manager];
        //console.log(manager);
        window.postMessage({type: 'socketiodev', data: {type: 'manager', message: manager}}, '*');
        io.managers[manager].engine.on('packetCreate', function (msg) {
          //console.log('msgsend', msg);
          window.postMessage({type: 'socketiodev', data: {type: 'packetCreate', manager: manager, message: msg, timestamp: Date.now() }}, '*');
        })
        io.managers[manager].engine.on('data', function (msg) {
          //console.log('msgrcv', msg);
          window.postMessage({type: 'socketiodev', data: {type: 'packetRcv', manager: manager, message: msg, timestamp: Date.now() }}, '*');
        });
        //console.log('taking sockets');
        var sockets = io.managers[manager].nsps;
        for (skt in sockets) {
          //console.log('skt', skt);
          if (sockets.hasOwnProperty(skt)) {
            //console.log('posting');
            window.postMessage({type: 'socketiodev', data: {type: 'socket', manager: manager, message: skt}}, '*');
          }
        }
      }
    }
    setTimeout(init, 2000);
  };
  init();
})();
},{}]},{},[1]);
