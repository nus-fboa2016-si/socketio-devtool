var $ = require('jquery');
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
      managers[managerName][socket] = {};
    }
  }
}

function getSocket(managerName, socketName) {
  if (managers[manager] === undefined || managers[manager][socketName] === undefined) {
    return undefined;
  }

  return managers[managerName][socketName];
}

function addSentPacketToSocket(managerName, socketName, type, packet) {
  var socket = getSocket(managerName, socketName);
  if (!socket) {
    if (!socket[type]) {
      socket[type] = [];
    }
    socket[type].push(packet);
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
