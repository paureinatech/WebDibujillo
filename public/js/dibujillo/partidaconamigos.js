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
        console.log("Current usuario", doc.data());
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

// Datos para crear partida
var nuevonumjugadores = 2;
var nuevocodigo = document.getElementById('codigonuevo');

// Datos unirse a partida
var numpartida = document.getElementById('nPartida');
var codigopartida = document.getElementById('codigo');

function seleccionarNumJugadores(num) {
    nuevonumjugadores = num;
    //console.log('Numero de jugadores elegidos: ' + nuevonumjugadores);
}

function createUUID() {
   var temp = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
   return temp.substring(0, 7);
}

function crearPartida() {
    var idpartida = createUUID();
    firestore.collection('partidas').doc(idpartida).set({
        id: idpartida,
        clave: nuevocodigo.value,
        num_jugadores: nuevonumjugadores,
        activos: 0,
        hay_hueco: true,
        jugadores: [],
        turno: 0,
        ronda: 1,
        chat: [],
        palabra: '',
        puntos: [],
        anchoLienzo: 0.0,
        nAciertos: 0,
    })
    .then(function() {
        console.log('Id partida: ' + idpartida);
        var partidaRef = firestore.collection("partidas").doc(idpartida);

        firestore.runTransaction(function(transaction) {
            return transaction.get(partidaRef).then(function(sfDoc) {
                if (!sfDoc.exists) {
                    throw "Document does not exist!";
                }

                var hay_hueco = sfDoc.data().hay_hueco;
                if (hay_hueco) {
                    transaction.update(partidaRef, {
                         jugadores: firebase.firestore.FieldValue.arrayUnion(
                             {
                                 apodo: usuario.apodo,
                                 email: usuario.email,
                                 photoUrl: usuario.photoUrl,
                                 score: 0,
                                 pause: false,
                             },
                         ),
                         activos: firebase.firestore.FieldValue.increment(1),
                         hay_hueco: sfDoc.data().activos + 1 < sfDoc.data().num_jugadores,
                     });
                    return "";
                } else {
                    return Promise.reject("No hay hueco.");
                }
            });
        }).then(function(newPopulation) {
            console.log("Jugador añadido correctamente");
            window.location.replace('partida.html?ref=' + idpartida);
        }).catch(function(err) {
            // This will be an "population is too big" error.
            console.error(err);
        });
    });
}

function unirsePartida() {
    var idpartida = nPartida.value;
    var codigo = codigopartida.value;
    if (idpartida != '') {
        var partidaRef = firestore.collection("partidas").doc(idpartida);
        firestore.runTransaction(function(transaction) {
            return transaction.get(partidaRef).then(function(sfDoc) {
                if (!sfDoc.exists) {
                    throw "Document does not exist!";
                }

                var hay_hueco = sfDoc.data().hay_hueco;
                if (hay_hueco) {
                    var a = {
                        usuario: usuario.email,
                        score: 0,
                    };
                    transaction.update(partidaRef, {
                         jugadores: firebase.firestore.FieldValue.arrayUnion(
                             {
                                 apodo: usuario.apodo,
                                 email: usuario.email,
                                 photoUrl: usuario.photoUrl,
                                 score: 0,
                                 pause: false,
                             },
                         ),
                         activos: firebase.firestore.FieldValue.increment(1),
                         hay_hueco: sfDoc.data().activos + 1 < sfDoc.data().num_jugadores,
                     });
                    return "";
                } else {
                    return Promise.reject("No hay hueco.");
                }
            });
        }).then(function(newPopulation) {
            console.log("Jugador añadido correctamente");
            window.location.replace('partida.html?ref=' + idpartida);
        }).catch(function(err) {
            // This will be an "population is too big" error.
            console.error(err);
        });
    }
    else {
        // Mostrar pop-up si no se introduce nada
    }
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
//---------------------------------------------------
// Llamada a funciones generales al cargar la paguina
//---------------------------------------------------

escucharAuthentication();

