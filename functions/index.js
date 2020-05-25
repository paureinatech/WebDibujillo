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

exports function test2(){
    console.log('TEST IMPORT PASADO');
}