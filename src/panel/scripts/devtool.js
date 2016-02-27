var $ = require('jquery');

var parser = window.parser;
var managers = {};

var selectedManager = null;
var selectedSocket = null;
var displayedPackets = [];

if (window.messenger) {
  messenger.on('manager', function(data) {
    if (managers[data] === undefined) {
      managers[data] = {};
    }
    displayManagers();
  });

  messenger.on('socket', function(data) {
    addSocketToManager(data.manager, data.message);
    displayManagers();
  });

  messenger.on('packetCreate', function(data) {
    var timestamp = data.timestamp;
    parser.decode(data, function(manager, data) {
      if (data.type !== 'ping') {
        // console.log('adding created packet ' + data + ' to socket / ' + ' in manager ' + manager);

        var packet = constructPacket(data.data[0], data.data[1], data.type, true, timestamp);
        addPacketToSocket(manager, data.nsp, packet);

        // console.log(getPackets(manager, data.nsp));
        console.log('isActive: ');
        console.log(isActive(manager, data.nsp));

        if (isActive(manager, data.nsp)) {
          var packets = getPackets(manager, data.nsp);
          displayPacketList(packets);
        }
      } else {
        console.log('ping packets are ignored');
      }
    });
  });

  messenger.on('packetRcv', function(data) {
    // console.log('RECEIVING PACKET, starting parser');
    // console.log(data);
    var timestamp = data.timestamp;
    parser.decode(data, function(manager, data) {
      // console.log('After parsing');
      // console.log(data);

      if (data.type !== 'ping') {
        console.log('adding received packet ' + data + ' to socket / ' + ' in manager ' + manager);

        var packet = constructPacket(data.data[0], data.data[1], data.type, false, timestamp);
        addPacketToSocket(manager, data.nsp, packet);

        if (isActive(manager, data.nsp)) {
          var packets = getPackets(manager, data.nsp);
          displayPacketList(packets);
        }  
      } else {
        console.log('ping packets are ignored');
      }

    });
  });
}

function addSocketToManager(managerName, socket) {
  if (managers[managerName]) {
    if (!managers[managerName][socket]) {
      managers[managerName][socket] = [];
    }
  }
}

function getSockets(manager) {
  var sockets = [];
  for (var socketName in manager) {
    sockets.push(socketName);
  }
  return sockets;
}

function getPackets(managerName, socketName) {
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

function addPacketToSocket(managerName, socketName, packet) {
  var packets = getPackets(managerName, socketName);
  if (packets) {
    packets.push(packet);
  }

  console.log('Packet added!');
  console.log(getPackets(managerName, socketName));
}

function packetsComparator(packet1, packet2) {
  return packet1._timestamp - packet2._timestamp;
}

function isActive(managerName, socketName) {
  if (!selectedManager || !selectedSocket) {
    return false;
  }

  return (selectedManager === managerName && selectedSocket === socketName);
}

function displayManagers() {
  $("#manager").html('');
  for (var managerName in managers) {
    $("#manager").append('<div>' + managerName);

    var sockets = getSockets(managers[managerName]);
    for (var i = 0; i < sockets.length; i++) {
      $("#manager").append('<ul>');
      $("#manager").append('<li class="sockets" id="' + managerName + '">' + sockets[i] + '</li>');
      $("#manager").append('</ul');
    }
    $("#manager").append('</div>');
  }

  $(".sockets").on("click", function() {
    var managerName = $(this).attr('id');
    var socketName = $(this).text();

    if (!isActive(managerName, socketName)) {
      var packets = getPackets(managerName, socketName);
      console.log("PACKETS CHOSEN");
      console.log(packets);
      packets.sort(packetsComparator);
      displayPacketList(packets);

      selectedManager = managerName;
      selectedSocket = socketName;
    }
  });
}

function displayPacketList(packets) {
  $("#packet").html('');
  for (var i = 0; i < packets.length; i++) {
    var packet = packets[i];
    var packetCategory = (packet._isCreated)? "packet-created" : "packet-received";

    $("#packet").append('<div class="packets ' + packetCategory + '">' + packet.event);
    $("#packet").append('</div>');
  }
}

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