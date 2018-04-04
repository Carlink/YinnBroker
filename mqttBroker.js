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

console.log('Servidor Mosca Corriendo en: ' + getIPAddress());

var server = new mosca.Server({
  //host: '192.168.1.76',
  host: getIPAddress(),
  port: 8000
});

server.on('clientConnected', function(client) {
  console.log('Cliente conectado:', client.id);
  if(client.id.toString() == 'YinnConnect'){
    let obj = {
      'YinnConnect': true
    };
    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  }
  if(client.id.toString() == 'YinnLight'){
    let obj = {
      'YinnLight': true
    };
    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  }
  if(client.id.toString() == 'YinnSense'){
    let obj = {
      'YinnSense': true
    };
    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  }
  if(client.id.toString() == 'YinnWeather'){
    let obj = {
      'YinnWeather': true
    };
    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  }
});

server.on('clientDisconnected', function(client) {
  console.log('Cliente desconectado:', client.id);
  if(client.id.toString() == 'YinnConnect'){
    let obj = {
      'YinnConnect': false
    };
    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  }
  if(client.id.toString() == 'YinnLight'){
    let obj = {
      'YinnLight': false
    };
    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  }
  if(client.id.toString() == 'YinnSense'){
    let obj = {
      'YinnSense': false
    };
    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  }
  if(client.id.toString() == 'YinnWeather'){
    let obj = {
      'YinnWeather': false
    };
    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  }
});

// server.on('published', function(packet, client) {
//   console.log(packet);
// });

server.on('subscribed', function(topic, client) {
  console.log('Se ha suscrito: ' + client.id + ' a ' + topic);
});

server.on('unsubscribed', function(topic, client) {
  console.log('Se ha unsuscrito: ' + client.id);    
});

server.on('published', function(packet, client) {
  let topico = packet.topic;
  let mensaje = '';
  //let mensaje = packet.payload.toString();
  // let mensaje = stringToBoolean(packet.payload.toString());
  // let mensaje = parseInt(packet.payload.toString());



  if(topico == 'sensores_internos/temperatura'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_internos/temperatura': mensaje
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));
  }
  

  if(topico == 'sensores_internos/luminosidad'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_internos/luminosidad': mensaje
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));
  }


  if(topico == 'sensores_internos/humedad'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_internos/humedad': mensaje
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));
  }

  if(topico == 'actuadores/ventilador'){
    console.log('Antes de procesar: ' + packet.payload.toString());
    mensaje = parseInt(packet.payload.toString());
  }

  if(topico == 'actuadores/bombilla'){
    mensaje = parseInt(packet.payload.toString());
  }
  

  

  console.log('Publicado en topic: ' + topico + ' - mensaje: ' + mensaje);
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

// Sensores Internos
var temperaturaInterna = '';
var luminosidadInterna = '';
var movimientoInterno = '';

// Actuadores
var ventilador = '';
var bombilla = '';

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca está corriendo');

  // Sensores Internos
  firebase.database().ref('dispositivos/cliente-1').child('sensores_internos/temperatura').on('value',(snapshot)=>{
    temperaturaInterna = snapshot.val();
    server.publish({topic: 'sensores_internos/temperatura', payload: temperaturaInterna}, function() {
      console.log('Temperatura Actualizada con: ', temperaturaInterna);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('sensores_internos/luminosidad').on('value',(snapshot)=>{
    luminosidadInterna = snapshot.val();
    server.publish({topic: 'sensores_internos/luminosidad', payload: luminosidadInterna}, function() {
      console.log('Luminosidad Actualizada con: ', luminosidadInterna);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('sensores_internos/humedad').on('value',(snapshot)=>{
    movimientoInterno = snapshot.val();
    server.publish({topic: 'sensores_internos/humedad', payload: movimientoInterno}, function() {
      console.log('Humedad Actualizada con: ', movimientoInterno);
    });
  })

  // Actuadores
  firebase.database().ref('dispositivos/cliente-1').child('actuadores/ventilador').on('value',(snapshot)=>{
    ventilador = snapshot.val() ? '0' : '1';
    server.publish({topic: 'actuadores/ventilador', payload: ventilador}, function() {
      console.log('Ventilador Actualizado con: ', ventilador);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('actuadores/bombilla').on('value',(snapshot)=>{
    bombilla = snapshot.val() ? '0' : '1';
    server.publish({topic: 'actuadores/bombilla', payload: bombilla}, function() {
      console.log('Bombilla Actualizada con: ', bombilla);
    });
  })

  let obj = {
      'YinnConnect': false,
      'YinnLight': false,
      'YinnSense': false,
      'YinnWeather': false
    };
    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  // server.subscribe('Conexion');
}

function stringToBoolean(string){
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}

function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
  return '0.0.0.0';
}


//var ledCommand = '001';

// setInterval(function() {
//   ledCommand = (ledCommand === '001') ? '002' : '001';
//   server.publish({topic: 'Conexion', payload: ledCommand});
// }, 1000);


// setInterval(function() {
	
// }, 3000);