$("#tabs").tabs().hide();
var socket = io();

socket.on('token', function(msg){
  if (msg.token) {
    window.open(msg.token, msg.cid);
  } else {
    console.error('invalid token');
  }
});
