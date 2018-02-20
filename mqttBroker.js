var mosca = require('mosca');
// import * as firebase from 'firebase/app' ;
// import 'firebase/auth';
// import 'firebase/database';

// const config = {
// 	apiKey: "AIzaSyASrcvPNyhSlUYTbg0o2g_MFfw5rTdgnS0",
//     authDomain: "yinn-7dbd2.firebaseapp.com",
//     databaseURL: "https://yinn-7dbd2.firebaseio.com",
//     projectId: "yinn-7dbd2",
//     storageBucket: "yinn-7dbd2.appspot.com",
//     messagingSenderId: "17822749213"
// };


var server = new mosca.Server({
  //host: '192.168.1.76',
  host: '127.0.0.1',
  port: 3000
});

server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

server.on('clientDisconnected', function(client) {
  console.log('client disconnected', client.id);
});

server.on('published', function(packet, client) {
  console.log(packet);
});

server.on('subscribed', function(topic, client) {
  console.log('subscribed: ' + client.id);
});

server.on('unsubscribed', function(topic, client) {
  console.log('unsubscribed: ' + client.id);    
});

server.on('ready', function() {
  console.log('Mosca server is up and running');
});
// server.on('temperatura', function(topic, client) {
//   firebase.database().ref('dispositivos/cliente-1').child('temperatura').set(topic.payload)
// });

var ledCommand = '001';

setInterval(function() {
  ledCommand = (ledCommand === '001') ? '002' : '001';
  server.publish({topic: 'LEDToggle', payload: ledCommand});
}, 1000);



// setInterval(function() {
// 	firebase.database().ref('dispositivos/cliente-1').child('ventilador').on('value',(snapshot)=>{
// 		ledCommand = snapshot.val();
// 		server.publish({topic: 'LEDToggle', payload: ledCommand});
// 	})
// }, 3000);