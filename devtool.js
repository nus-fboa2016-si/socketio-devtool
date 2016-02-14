if(window.messenger){
  document.getElementById('hello').innerText = 'messenger detected';
  messenger.on('io', function(io){
    if(io == 'no-io'){
      document.getElementById('hello2').innerText = 'no io detected';
    }else if(io == 'global-io'){
      document.getElementById('hello2').innerText = 'global io detected';
    }
  })
}else{
  document.getElementById('hello').innerText ='no messenger';
}