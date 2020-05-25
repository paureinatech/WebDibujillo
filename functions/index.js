const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*exports.comprobarUsuario = functions.firestore.ref('/usuarios/{user}')
    .onCreate((snapshot, context) => {
      const original = snapshot.val();
      console.log('Usuario creado con ID: ', context.params.user, original.email);
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });*/

exports.test = function () {
    console.log('Test pasado con functions');
}

var email = 'prueba@gmail.com';
var nickname = 'prueba';
var password = '123456';

exports.registerIn = async function signIn() {

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
         });
        window.location.replace("juegos.html");
    }
    else {
        console.log('No se ha podido registrar correctamente');
    }
    return result;
}

function validateForm() {
    return true;
}
