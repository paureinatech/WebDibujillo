// Your web app's Firebase configuration
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
var email = document.getElementById('email');

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
        cargarSocial();
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

// Funciones propias de la pantalla social

//-------------------------------------------------------------------

var segmento = 0;
var tabla = document.getElementById('tabla');

function cargarSocial() {
    if (segmento == 0) {
        tabla.innerHTML = '<table class="table user-list"><thead><tr><th><span>Nick</span></th><th><span>Puntos</span></th><th><span>Monedas</span></th></tr></thead><tbody id="tablacontent"></tbody></table>';
        usuario.amigos.forEach(cargarAmigo);
    }
    else {
        tabla.innerHTML = '<table class="table user-list"><thead><tr><th><span>Nick</span></th><th><span>Puntos</span></th></tr></thead><tbody id="tablacontent"></tbody></table>';
        usuario.solicitudes.forEach(cargarSolicitud);
    }
}

function cargarAmigo(amigo) {
    var tablacontent = document.getElementById('tablacontent');
    tablacontent.innerHTML += '<tr id="' + amigo + '"></tr>';
    firestore.collection('usuarios').doc(amigo).get().then(function (doc) {
        if (doc.exists) {
            var usuario = doc.data();
            var filaamigo = document.getElementById(amigo);
            filaamigo.innerHTML = '<td><img class="aspect" src="' + usuario.photoUrl + '" alt=""><span href="#" class="user-link">' + usuario.apodo + '</span></td><td>' + usuario.total_puntos + '</td><td>' + usuario.monedas + '</td>';
        }
    });
}

function cargarSolicitud(solicitud) {
    var tablacontent = document.getElementById('tablacontent');
    tablacontent.innerHTML += '<tr id="' + solicitud + '"></tr>';
    firestore.collection('usuarios').doc(solicitud).get().then(function (doc) {
        if (doc.exists) {
            var usuario = doc.data();
            var filaamigo = document.getElementById(solicitud);
            filaamigo.innerHTML = '<td><img class="aspect" src="' + usuario.photoUrl + '" alt=""><span href="#" class="user-link">' + usuario.apodo + '</span></td><td>' + usuario.total_puntos + '</td><td style="width: 20%;"><a class="table-button"><span onclick=aceptarSolicitud("' + solicitud + '") class="btn fa-stack"><i class="fa fa-check fa-stack-2x "></i></span></a><a class="table-button"><span onclick=denegarSolicitud("' + solicitud + '") class="btn fa-stack"><i class="fa fa-times fa-stack-2x "></i></span></a></td>';
        }
    });
}

function aceptarSolicitud(correo) {
    firestore.collection('usuarios').doc(usuario.email).update({
        solicitudes: firebase.firestore.FieldValue.arrayRemove(correo),
        amigos: firebase.firestore.FieldValue.arrayUnion(correo),
    });
    firestore.collection('usuarios').doc(correo).update({
        amigos: firebase.firestore.FieldValue.arrayUnion(usuario.email),
    });
}

function denegarSolicitud(correo) {
    firestore.collection('usuarios').doc(usuario.email).update({
        solicitudes: firebase.firestore.FieldValue.arrayRemove(correo),
    });
}

function enviarSolicitud(correo) {
    firestore.collection('usuarios').doc(correo).update({
        solicitudes: firebase.firestore.FieldValue.arrayUnion(usuario.email)
    }).catch(function(error){
        alert("El usuario no existe");
        console.log("Error al enviar solicitud");
        console.log(error.message);
    });
}

async function sendRequest() {
    if(email.value == usuario.email){
    }
    else{
        enviarSolicitud(email.value);
    }
}

escucharAuthentication();

//$(document).ready(function() {
//
//})

$('.amigos').click(function() {
    if (!($('.amigos').hasClass("active"))) {
        segmento = 0;
        $('.amigos').addClass("active");
        $('.solicitudes').removeClass("active");
        $('.user-list').html("");
    }
    cargarSocial();
})

$('.solicitudes').click(function() {
    if (!($('.solicitudes').hasClass("active"))) {
        segmento = 1;
        $('.solicitudes').addClass("active");
        $('.amigos').removeClass("active");
        $('.user-list').html("");
    }
    cargarSocial();
})