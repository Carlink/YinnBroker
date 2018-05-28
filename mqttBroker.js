// Imporatcion de Librerias

var mosca = require('mosca');
var firebase = require("firebase");
var schedule = require('node-schedule');

// Declaracion de Variables

var rutinas = {};

//Yinn Sense
var temperaturaInterna = '';
var humedadInterna = '';
var luminosidadInterna = '';
var movimientoInterno = '';

//Yinn Weather
var temperaturaExterna = '';
var humedadExterna = '';
var luminosidadExterna = '';
var movimientoExterna = '';
var lluviaExterna = '';

//Yinn Light
var ventilador = false;
var consumoVentilador = '';

//Yinn Connect
var bombilla = false;
var consumoBombilla = '';

// Declaracion de Variables de configuración



var config = {
  apiKey: "AIzaSyASrcvPNyhSlUYTbg0o2g_MFfw5rTdgnS0",
  authDomain: "yinn-7dbd2.firebaseapp.com",
  databaseURL: "https://yinn-7dbd2.firebaseio.com",
  storageBucket: "yinn-7dbd2.appspot.com",
};
firebase.initializeApp(config);


var server = new mosca.Server({
  //host: '192.168.1.76',
  host: getIPAddress(),
  port: 8000
});

// Inicio del programa



console.log('Servidor Mosca Corriendo en: ' + getIPAddress());

// Evento: Cuando se conecta un cliente de Arduino MQTT se actualiza su datoen firebase

server.on('clientConnected', function(client) {
  console.log('Cliente conectado:' + client.id);

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

// Evento: Desconexion de Cliente, pone en falso la actividad del modulo

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

// Evento: Cuando un cliente se suscribe a algun topico

server.on('subscribed', function(topic, client) {
  console.log('Se ha suscrito: ' + client.id + ' a ' + topic);
});

// Evento: Cuando un cliente se desuscribe a algun topico

server.on('unsubscribed', function(topic, client) {
  console.log('Se ha unsuscrito: ' + client.id);    
});

// Evento: Cuando un cliente publica algo en algun topico

server.on('published', function(packet, client) {
  let topico = packet.topic;
  let mensaje = '';

  //Yinn Sense

  



  if(topico == 'sensores_internos/temperatura'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_internos/temperatura': mensaje,
      'dispositivos_activos/YinnSense': true
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));

    correrRutinas();
  }

  else if(topico == 'dispositivos_activos/YinnLight'){
    let obj = {
      'YinnLight': true
    };
    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  }

  else if(topico == 'sensores_internos/humedad'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_internos/humedad': mensaje,
      'dispositivos_activos/YinnSense': true
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));

    correrRutinas();
  }
  
  else if(topico == 'sensores_internos/luminosidad'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_internos/luminosidad': mensaje,
      'dispositivos_activos/YinnSense': true
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));

    correrRutinas();
  }

  else if(topico == 'sensores_internos/movimiento'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_internos/movimiento': mensaje,
      'dispositivos_activos/YinnSense': true
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));

    correrRutinas();
  }

  //Yinn Weather

  else if(topico == 'sensores_externos/temperatura'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_externos/temperatura': mensaje,
      'dispositivos_activos/YinnWeather': true
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));

    correrRutinas();
  }

  else if(topico == 'sensores_externos/humedad'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_externos/humedad': mensaje,
      'dispositivos_activos/YinnWeather': true
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));

    correrRutinas();
  }

  else if(topico == 'sensores_externos/lluvia'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_externos/lluvia': mensaje,
      'dispositivos_activos/YinnWeather': true
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));

    correrRutinas();
  }  
  
  else if(topico == 'sensores_externos/luminosidad'){
    mensaje = parseInt(packet.payload.toString());
    let obj = {
      'sensores_externos/luminosidad': mensaje,
      'dispositivos_activos/YinnWeather': true
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));

    correrRutinas();
  }

  else if(topico == 'sensores_externos/movimiento'){
    mensaje = stringToBoolean(packet.payload.toString());
    let obj = {
      'sensores_externos/movimiento': mensaje,
      'dispositivos_activos/YinnWeather': true
    };
    firebase.database().ref('dispositivos/cliente-1').update(obj,(function (err) {

    }));

    correrRutinas();
  }

  //Yinn Light

  else if(topico == 'actuadores/ventilador'){
    // console.log('Antes de procesar: ' + packet.payload.toString());
    mensaje = parseInt(packet.payload.toString());
  }

  //Yinn Connect

  else if(topico == 'actuadores/bombilla'){
    mensaje = parseInt(packet.payload.toString());
  }

  // console.log('Publicado en topic: ' + topico + ' - mensaje: ' + mensaje);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca está corriendo');

  //Sensores Internos

  firebase.database().ref('dispositivos/cliente-1').child('sensores_internos/temperatura').on('value',(snapshot)=>{
    temperaturaInterna = snapshot.val();
    server.publish({topic: 'sensores_internos/temperatura', payload: temperaturaInterna}, function() {
      // console.log('Temperatura Interna Actualizada con: ', temperaturaInterna);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('sensores_internos/luminosidad').on('value',(snapshot)=>{
    luminosidadInterna = snapshot.val();
    server.publish({topic: 'sensores_internos/luminosidad', payload: luminosidadInterna}, function() {
      // console.log('Luminosidad Interna Actualizada con: ', luminosidadInterna);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('sensores_internos/humedad').on('value',(snapshot)=>{
    humedadInterno = snapshot.val();
    server.publish({topic: 'sensores_internos/humedad', payload: humedadInterno}, function() {
      // console.log('Humedad Interna Actualizada con: ', humedadInterno);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('sensores_internos/movimiento').on('value',(snapshot)=>{
    movimientoInterno = snapshot.val();
    server.publish({topic: 'sensores_internos/movimiento', payload: movimientoInterno}, function() {
      // console.log('Movimiento Interna Actualizada con: ', movimientoInterno);
    });
  })

  //Sensores Externos

  firebase.database().ref('dispositivos/cliente-1').child('sensores_externos/temperatura').on('value',(snapshot)=>{
    temperaturaExterna = snapshot.val();
    server.publish({topic: 'sensores_externos/temperatura', payload: temperaturaExterna}, function() {
      // console.log('Temperatura Externa Actualizada con: ', temperaturaExterna);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('sensores_externos/luminosidad').on('value',(snapshot)=>{
    luminosidadExterna = snapshot.val();
    server.publish({topic: 'sensores_externos/luminosidad', payload: luminosidadExterna}, function() {
      // console.log('Luminosidad Externa Actualizada con: ', luminosidadExterna);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('sensores_externos/humedad').on('value',(snapshot)=>{
    humedadExterna = snapshot.val();
    server.publish({topic: 'sensores_externos/humedad', payload: humedadExterna}, function() {
      // console.log('Humedad Externa Actualizada con: ', humedadExterna);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('sensores_externos/lluvia').on('value',(snapshot)=>{
    lluviaExterna = snapshot.val();
    server.publish({topic: 'sensores_externos/lluvia', payload: lluviaExterna}, function() {
      // console.log('Lluvia Externa Actualizada con: ', lluviaExterna);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('sensores_externos/movimiento').on('value',(snapshot)=>{
    movimientoExterna = snapshot.val();
    server.publish({topic: 'sensores_externos/movimiento', payload: movimientoExterna}, function() {
      // console.log('Movimiento Externa Actualizada con: ', movimientoExterna);
    });
  })

  //Actuadores
  firebase.database().ref('dispositivos/cliente-1').child('actuadores/ventilador').on('value',(snapshot)=>{
    ventilador = snapshot.val() ? '0' : '1';
    server.publish({topic: 'actuadores/ventilador', payload: ventilador}, function() {
      // console.log('Ventilador Actualizado con: ', ventilador);
    });
  })
  firebase.database().ref('dispositivos/cliente-1').child('actuadores/bombilla').on('value',(snapshot)=>{
    bombilla = snapshot.val() ? '0' : '1';
    server.publish({topic: 'actuadores/bombilla', payload: bombilla}, function() {
      // console.log('Bombilla Actualizada con: ', bombilla);
    });
  })

  //Rutinas

  firebase.database().ref('dispositivos/cliente-1').child('rutinas').on('value',(snapshot)=>{
    rutinas = snapshot.exportVal();
    
    correrRutinas();
  })

  setTimeout(function() {
    let obj = {
      'YinnConnect': false,
      'YinnLight': false,
      'YinnSense': false,
      'YinnWeather': false
    };

    firebase.database().ref('dispositivos/cliente-1/dispositivos_activos').update(obj,(function (err) {

    }));
  }, 3000);

  
  // server.subscribe('Conexion');
}

function correrRutinas(){
  let obj = rutinas;

  if(obj){
      Object.keys(obj).forEach(function(key) {
        if(obj[key].activo && obj[key].code != ''){
            try {
            // while(true){
              // console.log(obj[key].code);
              eval(obj[key].code);
            // }   
            
            // console.log((obj[key].code));
          } catch (e) {
            console.log(e);        
          }
        }

      
      });
    }
}

function stringToBoolean(string){
  switch(string.toLowerCase().trim()){
    case "true": case "yes": case "1": return true;
    case "false": case "no": case "0": case null: return false;
    default: return Boolean(string);
  }
}

function getIPAddress() {
  // return '192.168.0.100';
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

function yinnlightswitch(sw) {

  let obj = {
      'bombilla': sw
  };
  
  firebase.database().ref('dispositivos/cliente-1/actuadores').update(obj,(function (err) {
    // console.log('actualizado!!');
    // console.log('error:',err);
  })); 

}

function yinnconnectswitch(sw) {

  let obj = {
      'ventilador': sw
  };
  
  firebase.database().ref('dispositivos/cliente-1/actuadores').update(obj,(function (err) {
    // console.log('actualizado!!');
    // console.log('error:',err);
  })); 

}

function crearCron(min, hr, lu, ma, mi, ju, vi, sa, dom, funcion){

  let cadenaCron = '';
  let dias = '';

  if(lu == true){
    dias = dias + '1'
  }
  if(ma == true){
    if(dias == ''){
      dias = dias + '2'
    }
    else{
      dias = dias + ',2'
    }
  }
  if(mi == true){
    if(dias == ''){
      dias = dias + '3'
    }
    else{
      dias = dias + ',3'
    }
  }
  if(ju == true){
    if(dias == ''){
      dias = dias + '4'
    }
    else{
      dias = dias + ',4'
    }
  }
  if(vi == true){
    if(dias == ''){
      dias = dias + '5'
    }
    else{
      dias = dias + ',5'
    }
  }
  if(sa == true){
    if(dias == ''){
      dias = dias + '6'
    }
    else{
      dias = dias + ',6'
    }
  }
  if(dom == true){
    if(dias == ''){
      dias = dias + '7'
    }
    else{
      dias = dias + ',7'
    }
  }
  if(lu == false && ma == false && mi == false && ju == false && vi == false && sa == false && dom == false){
    dias = '*';
  }

  cadenaCron = '1 ' + (min != 0 ? min : '*') + ' ' + (hr != 0 ? hr : '*') + ' * * ' + dias;

  // console.log(cadenaCron);

  var j = schedule.scheduleJob(cadenaCron , function(){
    eval(funcion);
  });

  // j.cancel();
}


//var ledCommand = '001';

// setInterval(function() {
//   ledCommand = (ledCommand === '001') ? '002' : '001';
//   server.publish({topic: 'Conexion', payload: ledCommand});
// }, 1000);


// setInterval(function() {
	
// }, 3000);