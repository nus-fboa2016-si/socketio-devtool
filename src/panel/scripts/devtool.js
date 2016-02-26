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
    var timestamp = data.timestamp;
    parser.decode(data, function(manager, data) {
      if (data.type !== 'ping') {
        window.logger.emit('log', 'adding created packet ' + data + ' to socket / ' + ' in manager ' + manager);
        addCreatedPacketToSocket(manager, data.nsp, data.type, data.data, timestamp);
        window.logger.emit('log', getSocket(manager, data.nsp));
      } else {
        window.logger.emit('log', 'ping packets are ignored');
      }
    });
  });

  messenger.on('packetRcv', function(data) {
    var timestamp = data.timestamp;
    parser.decode(data, function(manager, data) {
      if (data.type !== 'ping') {
        window.logger.emit('log', 'adding received packet ' + data + ' to socket / ' + ' in manager ' + manager);
        addReceivedPacketToSocket(manager, data.nsp, data.type, data.data, timestamp);
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
      managers[managerName][socket] = [];
    }
  }
}

function getSocket(managerName, socketName) {
  if (managers[managerName] === undefined || managers[managerName][socketName] === undefined) {
    return undefined;
  }

  return managers[managerName][socketName];
}

function constructPacket(event, data, type, isCreated, timestamp) {
  var packet = {};
  packet['event'] = event;
  packet['data'] = data;
  packet['type'] = type;
  packet['_isCreated'] = isCreated;
  packet['_timestamp'] = timestamp;
  return packet;
}

function addCreatedPacketToSocket(managerName, socketName, type, packet, timestamp) {
  var socket = getSocket(managerName, socketName);
  if (socket) {
    var packet = constructPacket(packet[0], packet[1], type, true, timestamp);
    socket.push(packet);
  }
}

function addReceivedPacketToSocket(managerName, socketName, type, packet, timestamp) {
  var socket = getSocket(managerName, socketName);
  if (socket) {
    var packet = constructPacket(packet[0], packet[1], type, false, timestamp);
    socket.push(packet);
  }
}

function packetsComparator(packet1, packet2) {
  return packet1._timestamp - packet2._timestamp;
}

// function getCreatedPackets(managerName, socketName) {
//   var socket = getSocket(managerName, socketName);
//   if (socket) {
//     if (socket['created']) {
//       return socket['created'];
//     }
//   }
// }

// function getReceivedPackets(managerName, socketName) {
//   var socket = getSocket(managerName, socketName);
//   if (socket) {
//     if (socket['received']) {
//       return socket['received'];
//     }
//   }
// }

function renderManagers() {
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