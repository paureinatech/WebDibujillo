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



// Estas funciones son basicas de funcionamiento, NO TOCAR

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
        window.location.replace("juegos.html");

      } else {
        // User is signed out.
        // ...
        console.log("No hay usuario logueado");
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
async function pruebita() {
  alert("Holi");
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

//-------------------------------------------------------------------
// Funciones propias de la pantalla de inicio de sesion
// EStas son las funciones propias de cada pantalla y donde debeis modificar
//-------------------------------------------------------------------

var email = document.getElementById('email');
var password = document.getElementById('password');
var signInButton = document.getElementById('signInButton');

async function signIn() {

    if (!validateForm()) {
        return;
    }
    else {
      console.log('Logueando...');
    }

    var result = true;

    await firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Error al iniciar sesion');
      console.log(errorMessage);
      // ...
      result = false;
    });
    if (result == true) {
        console.log('Sesion iniciada con exito');
        window.location.replace("juegos.html");
    }
    else {
        console.log('No se ha podido iniciar sesion');
        document.signInForm.password.focus();
    }

    return result;
}

function validateForm() {
    console.log('Comprobando campos');
    if (document.signInForm.email.value == "") {
        alert("Por favor introduzca su email");
        document.signInForm.email.focus();
        return false;
    }
    if (document.signInForm.password.value == "") {
        alert("Por favor introduzca su contraseña");
        document.signInForm.password.focus();
        return false;
    }
    //console.log(document.signInForm.email)
    return ( true );
}

// No tocar esta linea y dejarla puesta en todos los JS
escucharAuthentication();