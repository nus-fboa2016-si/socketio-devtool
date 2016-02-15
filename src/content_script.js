window.addEventListener('message', function(event) {
  if (event.source != window || !event.data) return;
  var message = event.data;
  console.log(message);

  if(event.data.type == 'socketiodev') {
    console.log('event', event);
    chrome.runtime.sendMessage(message.data);
  }
});

