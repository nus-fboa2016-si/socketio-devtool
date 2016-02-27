var panels = chrome && chrome.devtools && chrome.devtools.panels;


  // Angular panel
  var panel = panels.create(
    "Socket.io",
    "icon.png",
    "panel/panel.html"
  );

