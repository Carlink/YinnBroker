var mosca = require('mosca');
var firebase = require("firebase");

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
// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyASrcvPNyhSlUYTbg0o2g_MFfw5rTdgnS0",
  authDomain: "yinn-7dbd2.firebaseapp.com",
  databaseURL: "https://yinn-7dbd2.firebaseio.com",
  storageBucket: "yinn-7dbd2.appspot.com",
};
firebase.initializeApp(config);

var server = new mosca.Server({
  //host: '192.168.1.76',
  host: '192.168.100.13',
  port: 8080
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

server.on('message', function(topic, message) {
  console.log(topic);
  console.log(message);
});

// server.on('temperatura', function(topic, client) {
//   firebase.database().ref('dispositivos/cliente-1').child('temperatura').set(topic.payload)
// });
// var ledCommand = '001';
server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca está corriendo');
  // server.subscribe('Conexion');
}

// var ledCommand = '001';

// setInterval(function() {
//   ledCommand = (ledCommand === '001') ? '002' : '001';
//   server.publish({topic: 'Conexion', payload: ledCommand});
// }, 1000);


// setInterval(function() {
// 	firebase.database().ref('dispositivos/cliente-1').child('ventilador').on('value',(snapshot)=>{
// 		ledCommand = snapshot.val();
// 		server.publish({topic: 'LEDToggle', payload: ledCommand});
// 	})
// }, 3000);