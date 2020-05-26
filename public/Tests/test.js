// Your web app's Firebase configuration
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

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
var firestore = firebase.firestore();

//Funciones propias de registro

var email = "pruebaweb@gmail.com";
var nickname = "test";
var password = "123456";

var user;
var usuario;

async function signIn() {

    if (!validateForm()) {
        return;
    }
    else {
      console.log('Registrando...');
    }

    var result = true;
    await firebase.auth().createUserWithEmailAndPassword(email, password).catch( function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log('Error al crear usuario');
      console.log(errorMessage);
      // ...
      result = false;
    });
    if (result == true) {
        console.log('Registro realizado con exito');
    }
    return result;
}

function validateForm() {
    return ( true );
}

async function registrarUsuario() {
    var result = true;
    await firestore.collection("usuarios").doc(email).set({
        email: email,
        apodo: nickname,
        total_puntos: 0,
        photoUrl:
            'https://img.vixdata.io/pd/jpg-large/es/sites/default/files/btg/bodyart.batanga.com/files/7-simpaticos-tatuajes-de-llamas-y-alpacas.jpg',
        monedas: 50,
        colores: ["0XFF000000"],
        iconos: [],
        amigos: [],
        solicitudes: [],
    }).catch( function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log('Error al registrar usuario');
        console.log(errorMessage);

        result = false;
    });
    return result;
}

async function eliminarCuenta() {

    await firebase.auth().onAuthStateChanged(function(user) {
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

            console.log('Sesion iniciada con exito');

            firestore.collection("usuarios").doc(email).delete()
            .then(function() {
                console.log("Usuario borrado de firestore");
            }).catch(function(error) {
                console.error("No se pudo borrar el usuario de firestore");
            });

            user.delete().then(function() {
              console.log('Usuario eliminado correctametne');
            }).catch(function(error) {
              console.log('No se pudo eliminar al usuario');
            });

        } else {
            // User is signed out.
            // ...
            console.log("No hay usuario logueado, volviendo al inicio");
        }
    });
}

async function escucharUsuario(email) {
    console.log("Comenzando a escuchar a " + email);
    await firestore.collection("usuarios").doc(email).onSnapshot(async function (doc) {
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

    await addMonedas(500);

    await comprarColor("0XFFE53935");
}

async function comprarColor(color) {
    if (usuario.monedas >= 50) {
        await firestore.collection('usuarios').doc(usuario.email).update({
            colores: firebase.firestore.FieldValue.arrayUnion(color),
            monedas: firebase.firestore.FieldValue.increment(-50),
        });
    }
}

async function addMonedas(coins) {
    await firestore.collection('usuarios').doc(usuario.email).update({
        monedas: firebase.firestore.FieldValue.increment(coins),
    });
}

async function main() {
    await eliminarCuenta();
    var result = await signIn();
    if (result) {
        var result2 = registrarUsuario();
        if (result2) {
            await escucharUsuario(email);
        }
        eliminarCuenta();
    }
    else {
        console.log('Fallo en los test');
    }
}

main();