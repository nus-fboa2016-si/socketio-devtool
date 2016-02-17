var $ = require('jquery');
var managers = {};

if (window.messenger) {
  messenger.on('manager', function(data) {
    if (managers[data] === undefined) {
      managers[data] = null;
    }
    renderManagers();
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

function renderManagers() {
  $("#manager").html();
  $("#manager").append("List of managers:");
  $("#manager").append("<ul>");
  for (var manager in managers) {
    $("#manager").append("<li id='"+manager+"'>" + manager + "</li>");
  }
  $("#manager").append("</ul>");
}