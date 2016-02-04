window.addEventListener('message', function(event) {
  if (event.source != window) return;
  var message = event.data;

  if(!event.data || event.data.type !== 'socketiodev') return;
  console.log('event', event);
  chrome.runtime.sendMessage(message);
});

