// Your web app's Firebase configuration
/*
var firebaseConfig = {
    apiKey: "AIzaSyDzJ50PyRubhuR2I3dSBUcS70rYpi5FV9M",
    authDomain: "dibujillo.firebaseapp.com",
    databaseURL: "https://dibujillo.firebaseio.com",
    projectId: "dibujillo",
    storageBucket: "dibujillo.appspot.com",
    messagingSenderId: "695183399338",
    appId: "1:695183399338:web:d43ad736ccdaf6c20833d3",
    measurementId: "G-9700NMW0BJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var firestore = firebase.firestore();

var user = null;

var usuario;

function escucharAuthentication() {
    firebase.auth().onAuthStateChanged(function(user) {
      console.log('Cambios en el usuario');
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var photoURL = user.photoURL;
        var uid = user.uid;

        user = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        };

        escucharUsuario(user.email);

        console.log('Sesion iniciada con exito');

      } else {
        // User is signed out.
        // ...
        console.log("No hay usuario logueado, volviendo al inicio");
        window.location.replace("index.html");
      }
    });
}

function escucharUsuario(email) {
    console.log("Comenzando a escuchar a " + email);
    firestore.collection("usuarios").doc(email).onSnapshot(function (doc) {
        console.log("Current data", doc.data());
        var data = doc.data();
        usuario = {
            email : data.email,
            apodo : data.apodo,
            photoUrl : data.photoUrl,
            monedas : data.monedas,
            total_puntos : data.total_puntos,
            amigos : data.amigos,
            colores : data.colores,
            iconos : data.iconos,
            solicitudes : data.solicitudes,
        };
    });
}

async function signOut() {
    await firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("Sesion cerrada con exito");
      window.location.replace("index.html");
    }).catch(function(error) {
      // An error happened.
      console.log("Error al cerrar sesion");
      console.log(error.message);
    });
}

//-------------------------------------------------------------------

// Funciones propias de la pantalla de juego

//-------------------------------------------------------------------

var colores = [{nombre:"Negro", color:"0XFF000000", imagen:"img/colores/negro.png"},
{nombre:"Rojo", color:"0XFFFF2632", imagen:"img/colores/rojo.png"},
{nombre:"Azul", color:"0XFF1E88E5", imagen:"img/colores/azul_oscuro.png"},
{nombre:"Amarillo", color:"0XFFFFEB3B", imagen:"img/colores/amarillo.png"},
{nombre:"Verde", color:"0XFF4CAF50", imagen:"img/colores/verde_claro.png"},];

var listaJugadores = document.getElementById('listaJugadores');
//var lienzo = document.getElementById('canvas');
var lienzo = document.querySelector('#canvas')
var chat = document.getElementById('chat');

function escucharPartida(id) {

    firestore.collection('partidas').doc(id).onSnapshot(function(doc) {
        console.log("Current data: ", doc.data());

        var partida = doc.data();

        listaJugadores.innerHTML = "";
        var jugadores = partida.jugadores;
        jugadores.forEach(actualizarJugadores);

        chat.innerHTML = "";
        var mensajes = partida.chat;
        mensajes.forEach(actualizarChat);

        var puntos = partida.puntos;
        actualizarLienzo(puntos);

    });
}

function actualizarJugadores(jugador) {
    listaJugadores.innerHTML += '<a class="btn btn-success btn-lg buttonlist" role="button"><p style="float: left;" > &emsp;&emsp;' + jugador.usuario.apodo + '</p><p style="float: right">' + jugador.score + '</p></a>';
}

function actualizarChat(mensaje) {
    chat.innerHTML += '<a class="btn btn-success btn-lg buttonlist" role="button"><p style="float: left;" > &emsp;&emsp;' + mensaje.usuario.apodo + '</p><p style="float: right">' + mensaje.contenido + '</p></a>';
}

function actualizarLienzo(puntos) {
    let ctx = lienzo.getContext('2d');
    // Estilo de la linea
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    // Color de la linea
    ctx.strokeStyle = '#000000';

    var tocaSeparar = false;

    ctx.beginPath();
    ctx.clearRect(0, 0, 600, 600);
    puntos.forEach(function (punto) {
        if (punto.x > -1) {
            if (tocaSeparar) {
                ctx.moveTo(punto.x, punto.y);
                tocaSeparar = false;
            }
            ctx.lineTo(punto.x, punto.y);
        }
        else {
            tocaSeparar = true;
        }
    });
    ctx.stroke();
}

let lineas = [];
let correccionX = 0;
let correccionY = 0;
let pintarLinea = false;
var color = '#000000';

let posicion = lienzo.getBoundingClientRect();
correccionX = posicion.x;
correccionY = posicion.y;

lienzo.width = 600;
lienzo.height = 600;

function empezarDibujo() {
    pintarLinea = true;
    lineas.push([]);
    console.log('Pintamos');
    if (lineas.length == 0) {
        pintarLinea = false;
    }
}

function dibujarLinea (evento) {
    evento.preventDefault();
    if (pintarLinea) {
        let ctx = lienzo.getContext('2d');
        // Estilo de la linea
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        // Color de la linea
        ctx.strokeStyle = color;

        let nuevaPosicionX = 0;
        let nuevaPosicionY = 0;
        if (evento.changedTouches == undefined) {
            nuevaPosicionX = evento.layerX;
            nuevaPosicionY = evento.layerY;
        }
        else {
            nuevaPosicionX = evento.changedTouches[0].pageX - correccionX;
            nuevaPosicionY = evento.changedTouches[0].pageY - correccionY;
        }
        // Guardamos la linea
        lineas[lineas.length - 1].push({
            x: nuevaPosicionX,
            y: nuevaPosicionY
        });
        // Redibujamos todas las lineas guardadas
        ctx.beginPath();
        lineas.forEach(function (segmento) {
            ctx.moveTo(segmento[0].x, segmento[0].y);
            segmento.forEach(function (punto, index) {
                ctx.lineTo(punto.x, punto.y);
            });
        });
        ctx.stroke();
    }
}

function dejarDibujo() {
    pintarLinea = false;
    console.log('Dejamos de pintar');
}

escucharAuthentication();
escucharPartida('prueba');
*/

// Chat (WebRTC)
//
// Currently supported in Chrome and Firefox only.
// WebRTC support is ultra basic at the moment - send/receive // in current window only.
// Design based on Bookmarks app by // Eyal Zuri - http://dribbble.com/shots/1261465-Bookmarks-app-gif
//
// The below JS has been adapted from this excellent RTCDataChannel demo
// http://simpl.info/rtcdatachannel/

var sendChannel,
	receiveChannel,
	chatWindow = document.querySelector('.chat-window'),
	chatWindowMessage = document.querySelector('.chat-window-message'),
	chatThread = document.querySelector('.chat-thread');

// Create WebRTC connection
createConnection();

// On form submit, send message
chatWindow.onsubmit = function (e) {
	e.preventDefault();

	sendData();

	return false;
};

function createConnection () {
    var servers = null;

    if (window.mozRTCPeerConnection) {
	    window.localPeerConnection = new mozRTCPeerConnection(servers, {
	        optional: [{
	            RtpDataChannels: true
	        }]
	    });
    } else {
	    window.localPeerConnection = new webkitRTCPeerConnection(servers, {
	        optional: [{
	            RtpDataChannels: true
	        }]
	    });
    }

    try {
        // Reliable Data Channels not yet supported in Chrome
        sendChannel = localPeerConnection.createDataChannel('sendDataChannel', {
            reliable: false
        });
    } catch (e) {
    }

    localPeerConnection.onicecandidate = gotLocalCandidate;
    sendChannel.onopen = handleSendChannelStateChange;
    sendChannel.onclose = handleSendChannelStateChange;

    if (window.mozRTCPeerConnection) {
	    window.remotePeerConnection = new mozRTCPeerConnection(servers, {
	        optional: [{
	            RtpDataChannels: true
	        }]
	    });
    } else {
	    window.remotePeerConnection = new webkitRTCPeerConnection(servers, {
	        optional: [{
	            RtpDataChannels: true
	        }]
	    });
    }

    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
    remotePeerConnection.ondatachannel = gotReceiveChannel;

    // Firefox seems to require an error callback
    localPeerConnection.createOffer(gotLocalDescription, function (err) {
    });
}

function sendData () {
    sendChannel.send(chatWindowMessage.value);
}

function gotLocalDescription (desc) {
    localPeerConnection.setLocalDescription(desc);
    remotePeerConnection.setRemoteDescription(desc);
    // Firefox seems to require an error callback
    remotePeerConnection.createAnswer(gotRemoteDescription, function (err) {
    });
}

function gotRemoteDescription (desc) {
    remotePeerConnection.setLocalDescription(desc);
    localPeerConnection.setRemoteDescription(desc);
}

function gotLocalCandidate (event) {
    if (event.candidate) {
        remotePeerConnection.addIceCandidate(event.candidate);
    }
}

function gotRemoteIceCandidate (event) {
    if (event.candidate) {
        localPeerConnection.addIceCandidate(event.candidate);
    }
}

function gotReceiveChannel (event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = handleMessage;
    receiveChannel.onopen = handleReceiveChannelStateChange;
    receiveChannel.onclose = handleReceiveChannelStateChange;
}

function handleMessage (event) {
    var chatNewThread = document.createElement('li'),
    	chatNewMessage = document.createTextNode(event.data);

    // Add message to chat thread and scroll to bottom
    chatNewThread.appendChild(chatNewMessage);
    chatThread.appendChild(chatNewThread);
    chatThread.scrollTop = chatThread.scrollHeight;

    // Clear text value
    chatWindowMessage.value = '';
}

function handleSendChannelStateChange () {
    var readyState = sendChannel.readyState;

    if (readyState == 'open') {
        chatWindowMessage.disabled = false;
        chatWindowMessage.focus();
    	chatWindowMessage.placeholder = "";
    } else {
        chatWindowMessage.disabled = true;
    }
}

function handleReceiveChannelStateChange () {
    var readyState = receiveChannel.readyState;
}

lienzo.addEventListener('mousedown', empezarDibujo, false);
lienzo.addEventListener('mousemove', dibujarLinea, false);
lienzo.addEventListener('mouseup', dejarDibujo, false);

lienzo.addEventListener('touchstart', empezarDibujo, false);
lienzo.addEventListener('touchmove', dibujarLinea, false);
