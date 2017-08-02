/*
Usage:
  Create an API key in Rancher and start up with:

  node socket.js address.of.rancher:8080 access_key secret_key project_id

Based on https://gist.github.com/vincent99/491afed2306ba448dd89 to test websocket connections to Rancher server
*/
var WebSocket = require('ws');

var host = process.argv[2];
var accessKey = process.argv[3];
var secretKey = process.argv[4];
var projectId = process.argv[5];

var url = 'ws://'+accessKey+':'+secretKey+'@'+host+'/v1/projects/'+projectId+'/subscribe';
var socket = new WebSocket(url);

socket.on('open', function() {
  console.log('Socket opened');
});

socket.on('message', function(messageStr) {
  console.log(messageStr);
  var message = JSON.parse(messageStr);

  if ( message.name === 'ping' )
  {
    console.log('ping');
  }
  else if ( message.name === 'resource.change' && message.data )
  {
    var resource = message.data.resource;

    var info = 'name='+resource.name + ', state='+resource.state;
    if ( resource.transitioning !== 'no' )
    {
      info += ', transitioning='+resource.transitioning + ', message='+resource.transitioningMessage
    }

    console.log(message.resourceType, message.resourceId, 'changed:', info);
  }
});

socket.on('close', function() {
  console.log('Socket closed');
});
