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

async function signIn() {

    if (!validateForm()) {
        return;
    }
    else {
      console.log('Registrando...');
    }

    var result = true;
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        user
    }).catch( function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log('Error al registrar usuario');
      console.log(errorMessage);
      // ...
      result = false;
    });
    if (result == true) {
        console.log('Registro realizado con exito');
        await firestore.collection("usuarios").doc(email).set({
                        email: email,
                        apodo: nickname,
                        total_puntos: 0,
                        photoUrl:
                            'https://img.vixdata.io/pd/jpg-large/es/sites/default/files/btg/bodyart.batanga.com/files/7-simpaticos-tatuajes-de-llamas-y-alpacas.jpg',
                        monedas: 0,
                        colores: ["0xFF000000"],
                        iconos: [],
                        amigos: [],
                        solicitudes: [],
        }).catch( function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log('Error al registrar usuario');
            console.log(errorMessage);
        });
    }
    else {
        console.log('No se ha podido registrar correctamente');
    }
    return result;
}

function validateForm() {
    return ( true );
}

function eliminarCuenta() {

    user.delete().then(function() {
      console.log('Usuario eliminado correctametne');
    }).catch(function(error) {
      console.log('No se pudo eliminar al usuario');
    });

    firestore.collection("usuarios").doc(email).delete()
    .then(function() {
        console.log("Usuario borrado de firestore");
    }).catch(function(error) {
        console.error("No se pudo borrar el usuario de firestore");
    });

}

function escucharUsuario(email) {
console.log("Comenzando a escuchar a " + email);
firestore.collection("usuarios").doc(email).onSnapshot(function (doc) {
    console.log("Current data", doc.data());
            var data = doc.data();
            user = {
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

function comprarColor(color) {
    if (user.monedas >= 50) {
        firestore.collection('usuarios').doc(user.email).update({
        colores: firebase.firestore.FieldValue.arrayUnion(color),
        monedas: firebase.firestore.FieldValue.increment(-50),
        });
    }
}

function addMonedas(coins) {
    firestore.collection('usuarios').doc(user.email).update({
        monedas: firebase.firestore.FieldValue.increment(coins),
    });
}

await signIn();

await escucharUsuario(email);

await addMonedas(500);

await comprarColor("0XFFE53935");

//eliminarCuenta();
//probando el test