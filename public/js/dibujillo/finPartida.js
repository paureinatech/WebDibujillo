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
        conseguirIdPartida();
    });
}

function conseguirIdPartida() {
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    var idPartida = unescape(temp[1]);
    console.log("Id partida argumento: ", idPartida);
    escucharPartida(idPartida);
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

// Funciones propias de la pantalla de finPartida

//-------------------------------------------------------------------

var partidaActual;

var listaJugadores = document.getElementById('listaJugadores');

function escucharPartida(id) {

    firestore.collection('partidas').doc(id).onSnapshot(function(doc) {
        console.log("Current partida data: ", doc.data());

        var partida = doc.data();
        partidaActual = partida;

        if (partidaActual.ronda < 4) {
            window.location.replace('partida.html?ref=' + partidaActual.id);
        }

        listaJugadores.innerHTML = "";
        var jugadores = partida.jugadores;
        var jugadoresA = partida.jugadores;
        jugadoresA.sort((a,b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0));
        jugadoresA.forEach(actualizarJugadores);

    });
}

function actualizarJugadores(jugador) {
    listaJugadores.innerHTML += '<tr><td><img class="aspect" src="' + jugador.photoUrl + '" alt=""><a class="user-link">' + jugador.apodo + '</a></td><td>' + jugador.score + '</td></tr>';
}

async function canjearPuntos() {
    var jugador;
    for (jug in partidaActual.jugadores) {
        if (partidaActual.jugadores[jug].email == usuario.email) {
            jugador = partidaActual.jugadores[jug];
        }
    }
    await firestore.collection('usuarios').doc(jugador.email).update({
        total_puntos: firebase.firestore.FieldValue.increment(jugador.score),
    });
    canjearMonedas();
}

async function canjearMonedas() {

    var jugadores = partidaActual.jugadores;

    jugadores.sort((a,b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0));

    var ganadas = 0;
    var numComprobados = 0;
    while(numComprobados < jugadores.length) {
        if (jugadores[numComprobados].email == usuario.email) {
            ganadas = jugadores.length - numComprobados;
            console.log('Monedas ganadas por ' + jugadores[numComprobados].apodo + ': ' + ganadas);
        }
        numComprobados++;
    }

    //console.log(jugadores);

    await firestore.collection('usuarios').doc(jugador.email).update({
        monedas: firebase.firestore.FieldValue.increment(ganadas),
    });

    abandonarPartida(jugador);
}

function abandonarPartida(jugador) {
    firestore.collection('partidas').doc(partidaActual.id).update({
        jugadores: firebase.firestore.FieldValue.arrayRemove({
            email: jugador.email,
            apodo: jugador.apodo,
            photoUrl: jugador.photoUrl,
            score: jugador.score,
            pause: jugador.pause,
        }),
        activos: firebase.firestore.FieldValue.increment(-1),
        hay_hueco: false,
    }).then(function () {
        if (partidaActual.activos == 1) {
            firestore.collection('partidas').doc(partidaActual.id).delete();
        }
        window.location.replace("juegos.html");
    });
}

escucharAuthentication();