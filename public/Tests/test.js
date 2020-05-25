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

//Funciones propias de registro

var email = "partida@gmail.com";
var nickname = "test";
var password = "123456";

async function signIn() {

    if (!validateForm()) {
        return;
    }
    else {
      console.log('Registrando...');
    }

    var result = true;
    await firebase.auth().createUserWithEmailAndPassword(email.value, password.value).catch( function(error) {
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
        await firestore.collection("usuarios").doc(email.value).set({
                        email: email.value,
                        apodo: nickname.value,
                        total_puntos: 0,
                        photoUrl:
                            'https://img.vixdata.io/pd/jpg-large/es/sites/default/files/btg/bodyart.batanga.com/files/7-simpaticos-tatuajes-de-llamas-y-alpacas.jpg',
                        monedas: 0,
                        colores: ["0xFF000000"],
                        iconos: [],
                        amigos: [],
                        solicitudes: [],
         });
        window.location.replace("juegos.html");
    }
    else {
        console.log('No se ha podido registrar correctamente');
    }
    return result;
}

function validateForm() {
    return ( true );
}

