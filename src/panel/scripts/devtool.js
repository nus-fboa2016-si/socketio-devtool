var $ = require('jquery');

var parser = window.parser;
var managers = {};

if (window.messenger) {
  messenger.on('manager', function(data) {
    if (managers[data] === undefined) {
      managers[data] = {};
    }
    renderManagers();
    window.logger.emit('log', 'adding manager');
  });

  messenger.on('socket', function(data) {
    addSocketToManager(data.manager, data.message);
    window.logger.emit('log', 'adding socket ' + data.message + ' to manager ' + data.manager);
  });

  messenger.on('packetCreate', function(data) {
    parser.decode(data, function(manager, data) {
      if (data.type !== 'ping') {
        window.logger.emit('log', 'adding created packet ' + data + ' to socket / ' + ' in manager ' + manager);
        addCreatedPacketToSocket(manager, data.nsp, data.type, data.data);
        // window.logger.emit('log', 'rerender created packets');
        renderCreatedPackets(manager, '/');
      } else {
        window.logger.emit('log', 'ping packets are ignored');
      }
    });
  });

  messenger.on('packetRcv', function(data) {
    parser.decode(data, function(manager, data) {
      if (data.type !== 'ping') {
        window.logger.emit('log', 'adding received packet ' + data + ' to socket / ' + ' in manager ' + manager);
        addReceivedPacketToSocket(manager, data.nsp, data.type, data.data);
      }
    });
  });

  document.getElementById('hello').innerText = 'messenger detected';
  messenger.on('io', function(io){
    if(io == 'no-io'){
      document.getElementById('hello2').innerText = 'no io detected';
    }else if(io == 'global-io'){
      document.getElementById('hello2').innerText = 'global io detected';
    }
  })

} else {
  document.getElementById('hello').innerText ='no messenger';
}

function addSocketToManager(managerName, socket) {
  if (managers[managerName]) {
    if (!managers[managerName][socket]) {
      managers[managerName][socket] = { 'created': {}, 'received': {} };
    }
  }
}

function getSocket(managerName, socketName) {
  if (managers[managerName] === undefined || managers[managerName][socketName] === undefined) {
    return undefined;
  }

  return managers[managerName][socketName];
}

function addCreatedPacketToSocket(managerName, socketName, type, packet) {
  var socket = getSocket(managerName, socketName);  
  if (socket) {
    if (!socket['created'][type]) {
      socket['created'][type] = [];
    }
    socket['created'][type].push(packet);
  }
}

function addReceivedPacketToSocket(managerName, socketName, type, packet) {
  var socket = getSocket(managerName, socketName);  
  if (socket) {
    if (!socket['received'][type]) {
      socket['received'][type] = [];
    }
    socket['received'][type].push(packet);
  }
}

function getCreatedPackets(managerName, socketName) {
  var socket = getSocket(managerName, socketName);
  window.logger.emit('log', socket);
  if (socket) {
    if (socket['created']) {
      return socket['created'];
    }
  }
}

function getReceivedPackets(managerName, socketName) {
  var socket = getSocket(managerName, socketName);
  if (socket) {
    if (socket['received']) {
      return socket['received'];
    }
  }
}

function renderManagers() {
  $("#manager").html('');
  $("#manager").append("List of managers:");
  $("#manager").append("<ul>");
  for (var manager in managers) {
    $("#manager").append('<li class="manager" id="' + manager + '"">' + manager + '</li>');
  }
  $("#manager").append("</ul>");

  $(".manager").on("click", function() {
    var managerName = $(this).attr('id');
    renderSockets(managerName);
  })
}

function renderSockets(managerName) {
  $("#socket").html('');
  $("#socket").append("List of sockets of " + managerName + ":");
  $("#socket").append("<ul>");
  var manager = managers[managerName];
  for (var socket in manager) {
    $("#socket").append("<li>" + socket + "</li>");
  }
  $("#socket").append("</ul>");
}

function renderCreatedPackets(managerName, socketName) {
  $("#packet").html('');
  var packets = getCreatedPackets(managerName, socketName);
  if (packets) {
    for (var type in packets) {
      $("#packet").append(type + ': <br>');
      for (var i = 0; i < packets[type].length; i++) {
        var packet = packets[type][i][1];
        $("#packet").append(packet + "<br>");
      }
    }
  }
}