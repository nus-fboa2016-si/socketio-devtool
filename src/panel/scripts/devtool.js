var $ = require('jquery');

var parser = window.parser;
var managers = {};

var packetId = 0;

var selectedManager = null;
var selectedSocket = null;
var selectedSocketDOM = null;
var selectedPacketDOM = null;
var displayedPackets = {};
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
      //console.log('decoded createpkt:', data);
      // connect packet: ignore it because server would send a confirmation packet if
      // namespace is valid and we handle it from there
      if (data.type === 0 ){
        return;
      }
      if (data.type !== 'ping') {
        // console.log('adding created packet ' + data + ' to socket / ' + ' in manager ' + manager);

        var packet = constructPacket(data.data[0], data.data[1], data.type, true, timestamp);
        addPacketToSocket(manager, data.nsp, packet);

        // console.log(getPackets(manager, data.nsp));
        console.log('isActive: ');
        console.log(isActive(manager, data.nsp));

        if (isActive(manager, data.nsp)) {
          var packets = getPackets(manager, data.nsp);
          packets.sort(packetsComparator);
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
       //console.log('After parsing');
       //console.log(data);
      //error packet. for MVP we ignore it.
      if(data.type === 4){
        return;
      }
      //connection packet. handle it.
      if(data.type === 0){
        messenger.emit('socket', {manager: manager, message: data.nsp});
        return;
      }
      if (data.type !== 'ping') {
        //console.log('adding received packet ' + data + ' to socket / ' + ' in manager ' + manager);

        var packet = constructPacket(data.data[0], data.data[1], data.type, false, timestamp);
        addPacketToSocket(manager, data.nsp, packet);

        if (isActive(manager, data.nsp)) {
          var packets = getPackets(manager, data.nsp);
          packets.sort(packetsComparator);
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
  packetId++;
  packet['_id'] = packetId;
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
  return packet2._timestamp - packet1._timestamp;
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

    $("#manager").append('<div class="managerItem" >' + managerName + '</div>');
    var sockets = getSockets(managers[managerName]);
    $("#manager").append('<ul class="socketList"></ul>');
    for (socket in sockets) {
      console.log('appending socket');
      $("#manager").children('ul.socketList').append('<li class="sockets" id="' + managerName + '">' + sockets[socket] + '</li>');
    }
  }

  $(".sockets").on("click", function() {
    var managerName = $(this).attr('id');
    var socketName = $(this).text();
    $(this).addClass('selected');
    if(selectedSocketDOM) $(selectedSocketDOM).removeClass('selected');

    if (!isActive(managerName, socketName)) {
      var packets = getPackets(managerName, socketName);
      console.log("PACKETS CHOSEN");
      console.log(packets);
      if(packets.length === 0){
        $('#packet').html('no packets to display.');
      }else {
        packets.sort(packetsComparator);
        displayPacketList(packets);
      }
      selectedManager = managerName;
      selectedSocket = socketName;
      selectedSocketDOM = this;
    }
  });
}

function displayPacketList(packets) {
  $("#packet").html('');
  displayedPackets = {};
  for (var i = 0; i < packets.length; i++) {
    var packet = packets[i];
    var packetCategory = (packet._isCreated)? "packet-created" : "packet-received";
    $("#packet").append('<div id="' + packet._id + '" class="packets ' + packetCategory + '">' + convertTimestampToDateString(packet._timestamp) + 
      '&nbsp;&nbsp;' + packet.event); 
    $("#packet").append('</div>');
    displayedPackets[packet._id] = packet;
  }

  $(".packets").on("click", function() {
    $(this).addClass('selected');
    if(selectedPacketDOM) $(selectedPacketDOM).removeClass('selected');
    var selectedPacket = displayedPackets[$(this).attr('id')];
    console.log("SELECTED PACKET");
    console.log(selectedPacket);
    displayPacketContent(selectedPacket);
    selectedPacketDOM = this;
  });
}

function displayPacketContent(packet) {
  var packetData;
  if (typeof(packet.data) === 'object') {
    packetData = JSON.stringify(packet.data, null, 2);
  } else {
    packetData = packet.data;
  }

  $("#pkt-content").html('<pre>' + packetData + '</pre>');
}

function convertTimestampToDateString(timestamp) {
  var date = new Date(timestamp);

  var month = months[date.getMonth()];
  var dayInMonth = date.getDate();
  if (dayInMonth < 10) {
    dayInMonth += " ";
  }
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }

  return month + " " + dayInMonth + " " + hour + ":" + minute + ":" + second;
}
