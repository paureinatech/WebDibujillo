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
        listaColores.innerHTML = "";
        colores.forEach(cargarColores);
		cargarMonedas();
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

// Funciones propias de la pantalla de inicio de sesion

//-------------------------------------------------------------------

var colores = [{nombre:"Negro", color:"0XFF000000", imagen:"img/colores/negro.png"},
{nombre:"Rojo", color:"0XFFE53935", imagen:"img/colores/rojo.png"},
{nombre:"Azul", color:"0XFF1E88E5", imagen:"img/colores/azul_oscuro.png"},
{nombre:"Amarillo", color:"0XFFFFEB3B", imagen:"img/colores/amarillo.png"},
{nombre:"Verde", color:"0XFF4CAF50", imagen:"img/colores/verde_claro.png"},
{nombre:"Naranja", color:"0XFFEF6C00", imagen:"img/colores/naranja.png"},
{nombre:"Rosa", color:"0XFFF50057", imagen:"img/colores/rosa.png"},
{nombre:"Morado", color:"0XFF8E24AA", imagen:"img/colores/morado.png"},
{nombre:"Marron", color:"0XFF6D4C41", imagen:"img/colores/marron.png"},
{nombre:"Mar", color:"0xFF00E5FF", imagen:"img/colores/mar.png"},
{nombre:"Cesped", color:"0xFF76FF03", imagen:"img/colores/cesped.png"},
{nombre:"Algodon", color:"0xFFF8BBD0", imagen:"img/colores/algodon.png"},
{nombre:"Lila", color:"0xFFB39DDB", imagen:"img/colores/lila.png"},
{nombre:"Gris", color:"0XFF757575", imagen:"img/colores/plateado.png"},
{nombre:"Dibujillo", color:"0xFF00E676", imagen:"img/colores/dibujillo.png"}
{nombre:"Mandarina", color:"0xFFFFAB40", imagen:"img/colores/mandarina.png"}
{nombre:"Oceano", color:"0xFF3F51B5", imagen:"img/colores/oceano.png"},
{nombre:"Bosque", color:"0xFF009688", imagen:"img/colores/bosque.png"}
{nombre:"Salmon", color:"0xFFFA8072", imagen:"img/colores/salmon.png"}
];

var listaColores = document.getElementById('listaColores');
var numMonedas = document.getElementById('numMonedas');

function comprarColor(color) {
    if (usuario.monedas >= 50) {
        
        var opcion = confirm("¿Quieres comprar el color " + color.nombre + "?");
        if (opcion == true) {
            firestore.collection('usuarios').doc(usuario.email).update({
                colores: firebase.firestore.FieldValue.arrayUnion(color),
                monedas: firebase.firestore.FieldValue.increment(-50),
            });
        } 
    }
}

function cargarColores(color) {
    if (usuario.colores.includes(color.color)) {
        listaColores.innerHTML += '<a class="btn btn-success btn-lg" role="button"><p style="float: left;" > &emsp;&emsp;' + color.nombre + '<img align="left" src="' + color.imagen + '" width="30px"></p><p style="float: right"><img src="img/check.svg" width="30px"></p></a>';
    }
    else {
        listaColores.innerHTML += '<a class="btn btn-success btn-lg" role="button" onclick=comprarColor("' + color.color + '")><p style="float: left;" > &emsp;&emsp;' + color.nombre + '<img align="left" src="' + color.imagen + '" width="30px"></p><p style="float: right"> 50&nbsp; <img src="img/moneda.png" width="30px"></p></a>';
    }
}

function cargarMonedas() {
	numMonedas.innerHTML = '<h2  align="center">Monedas:  ' + usuario.monedas +  '<img src="img/moneda.png" width="30px" style="margin-left:15px">' + '</h2>';
}

async function signOut() {
    var opcion = confirm("¿Quieres cerrar la sesión?");
    if (opcion == true) {
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
}

escucharAuthentication();

