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
  host: '100.87.207.100',
  port: 1883
});

server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

server.on('clientDisconnected', function(client) {
  console.log('client disconnected', client.id);
});

// server.on('published', function(packet, client) {
//   console.log(packet);
// });

server.on('subscribed', function(topic, client) {
  console.log('subscribed: ' + client.id);
});

server.on('unsubscribed', function(topic, client) {
  console.log('unsubscribed: ' + client.id);    
});

server.on('published', function(packet, client) {
  let topico = packet.topic;
  let mensaje = stringToBoolean(packet.payload.toString());

  let obj = {
    'ventilador': mensaje
  };

  firebase.database().ref('dispositivos/cliente-1').child('actuadores').update(obj,(function (err) {

  }));

  console.log('Publicado en topic:' + topico + ' - mensaje:' + mensaje);
});

// server.on('message', function(topic, message) {
//   //console.log(topic);
//   //console.log(message);


//   let obj = {
//       'ventilador': message
//   };

//   firebase.database().ref('dispositivos/cliente-1').child('actuadores').update(obj,(function (err) {

//   }));
// });

// server.on('temperatura', function(topic, client) {
//   firebase.database().ref('dispositivos/cliente-1').child('temperatura').set(topic.payload)
// });
var ledCommand = '';

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca está corriendo');

  firebase.database().ref('dispositivos/cliente-1').child('actuadores/ventilador').on('value',(snapshot)=>{
    ledCommand = snapshot.val();
    server.publish({topic: 'LEDToggle', payload: ledCommand}, function() {
      console.log('Dato Actualizado');
    });
  })
  // server.subscribe('Conexion');
}

function stringToBoolean(string){
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}


//var ledCommand = '001';

// setInterval(function() {
//   ledCommand = (ledCommand === '001') ? '002' : '001';
//   server.publish({topic: 'Conexion', payload: ledCommand});
// }, 1000);


// setInterval(function() {
	
// }, 3000);