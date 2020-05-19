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
        console.log("Current usuario data", doc.data());
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

// Funciones propias de la pantalla de juego

//-------------------------------------------------------------------

var colores = [{nombre:"Negro", color:"0XFF000000", imagen:"img/colores/negro.png"},
{nombre:"Rojo", color:"0XFFFF2632", imagen:"img/colores/rojo.png"},
{nombre:"Azul", color:"0XFF1E88E5", imagen:"img/colores/azul_oscuro.png"},
{nombre:"Amarillo", color:"0XFFFFEB3B", imagen:"img/colores/amarillo.png"},
{nombre:"Verde", color:"0XFF4CAF50", imagen:"img/colores/verde_claro.png"},];

var listaJugadores = document.getElementById('listaJugadores');
//var lienzo = document.getElementById('canvas');
var lienzo = document.getElementById("canvas");
var chat = document.getElementById("chat");

var partidaActual;
var estado = 0;

function escucharPartida(id) {

    firestore.collection('partidas').doc(id).onSnapshot(function(doc) {
        console.log("Current partida data: ", doc.data());

        var partida = doc.data();
        partidaActual = partida;

        listaJugadores.innerHTML = "";
        var jugadores = partida.jugadores;
        jugadores.forEach(actualizarJugadores);

        chat.innerHTML = "";
        var mensajes = partida.chat;
        mensajes.forEach(actualizarChat);
        var lis = document.getElementById("chat").getElementsByTagName("li");
        if (lis.length > 0) {
            lis[lis.length-1].scrollIntoView();
        }

        var puntos = partida.puntos;
        actualizarLienzo(puntos);

        calcularEstado();

    });
}

function calcularEstado() {
    if (partidaActual.jugadores.length < 2) {
        console.log('Esperando jugadores');
        estado = 0;
    }
    else {
        if (partidaActual.ronda >= 4) {
            console.log('Fin partida');
            estado = 1;
        }
        else {
            if (usuario.email == partidaActual.jugadores[partidaActual.turno].email) {
                if (partidaActual.palabra == "") {
                    console.log('Toca elegir palabra');
                    if (!cuentaAtrasEleccionActivada) {
                        contadorEleccion = 10;
                        cuentaAtrasEleccionActivada = true;
                        cuentaAtrasEleccion(false);
                    }
                    elegirPalabra(true);
                    estado = 2;
                }
                else {
                    console.log('Toca dibujar');
                    contador = 60;
                    cuentaAtras(false);
                    cargarOpciones();
                    lienzo.addEventListener('mousedown', empezarDibujo, false);
                    lienzo.addEventListener('mousemove', dibujarLinea, false);
                    lienzo.addEventListener('mouseup', dejarDibujo, false);

                    //lienzo.addEventListener('touchstart', empezarDibujo, false);
                    //lienzo.addEventListener('touchmove', dibujarLinea, false);

                    estado = 3;
                }
            }
            else {
                if (partidaActual.palabra == "") {
                    console.log('Toca esperar que elijan palabra');
                    cuentaAtras(true);
                    cargarOpciones();
                    estado = 4;
                }
                else {
                    console.log('Toca adivinar');
                    contador = 60;
                    cuentaAtras(false);
                    estado = 5;
                }
            }
        }
    }
}

function pasarTurno() {
    var partidaRef = firestore.collection("partidas").doc(idpartida);
    firestore.runTransaction(function(transaction) {
        return transaction.get(partidaRef).then(function(sfDoc) {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }




            transaction.update(partidaRef, {
                 jugadores: firebase.firestore.FieldValue.arrayUnion(
                     {
                         apodo: usuario.apodo,
                         email: usuario.email,
                         photoUrl: usuario.photoUrl,
                         score: 0,
                     },
                 ),
                 activos: firebase.firestore.FieldValue.increment(1),
                 hay_hueco: sfDoc.data().activos + 1 < sfDoc.data().num_jugadores,
             });
            return "";
        });
    }).then(function(newPopulation) {
        console.log("Jugador añadido correctamente");
        window.location.replace('partida.html?ref=' + idpartida);
    }).catch(function(err) {
        // This will be an "population is too big" error.
        console.error(err);
    });
}

function actualizarJugadores(jugador) {
    listaJugadores.innerHTML += '<tr><td><img class="aspect" src="' + jugador.photoUrl + '" alt=""><a class="user-link">' + jugador.apodo + '</a></td><td>' + jugador.score + '</td></tr>';
}

function actualizarChat(mensaje) {
    chat.innerHTML += '<li><span class="chat-row-apodo">' + mensaje.usuario.apodo + '</span><span>' + mensaje.contenido + '</span></li>';
}

function actualizarLienzo(puntos) {
    let ctx = lienzo.getContext('2d');
    // Estilo de la linea
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.lineWidth = 3;

    var tocaSeparar = true;

    //ctx.beginPath();
    ctx.clearRect(0, 0, 600, 600);
    puntos.forEach(function (punto) {

        if (punto.x > -1) {
            // Color de la linea
            ctx.strokeStyle = '#' + punto.color.substring(punto.color.length - 6);
            //console.log('Color actual: ', ctx.strokeStyle);
            if (tocaSeparar) {
                ctx.beginPath();
                ctx.moveTo(punto.x * 1.7, punto.y * 1.7);
                tocaSeparar = false;
            }
            ctx.lineTo(punto.x * 1.7, punto.y * 1.7);

        }
        else {
            tocaSeparar = true;
            ctx.stroke();
        }
    });
    ctx.stroke();
}

function mandarMensaje(mensaje) {
    var timestamp = firebase.firestore.Timestamp.fromDate(new Date());
    firestore.collection('partidas').doc(partidaActual.id).update({
        chat: firebase.firestore.FieldValue.arrayUnion({
            contenido: mensaje,
            timestamp: timestamp,
            usuario: usuario,
        }),
    });
}

var contador = 0;
var timerCounter = document.getElementById('timerCounter');
var cuentaAtrasActivada = false;

function cuentaAtras(fin) {
    //console.log('Contador: ' + contador);
    if (fin == true) {
        contador = 0;
        cuentaAtrasActivada = false;
        timerCounter.innerHTML = '<h3 align="center">Contador: ' + contador + '</h3>';
    }
    else {
        cuentaAtrasActivada = true;
        timerCounter.innerHTML = '<h3 align="center">Contador: ' + contador + '</h3>';
        if (contador > 0) {
            contador -= 1;
            setTimeout("cuentaAtras()", 1000);
        }
        else {
            cuentaAtrasActivada = false;
        }
    }
}

var contadorEleccion = 0;
var cuentaAtrasEleccionActivada = false;

function cuentaAtrasEleccion(fin) {
    if (fin == true) {
        contadorEleccion = 0;
        cuentaAtrasEleccionActivada = false;
        //console.log('Contador Eleccion parado');
    }
    else {
        //console.log('ContadorEleccion: ' + contadorEleccion);
        if (contadorEleccion > 0) {
            contadorEleccion -= 1;
            setTimeout("cuentaAtrasEleccion()", 1000);
        }
        else {
            if (cuentaAtrasEleccionActivada) {
                // Pasar turno
                console.log('Hay que pasar turno');

                pasarTurno();

                cuentaAtrasEleccionActivada = false;
            }
        }
    }
}

var opcionesycolores = document.getElementById('opcionesycolores');

function cargarOpciones() {
    console.log('Cargo opciones');
    opcionesycolores.style.padding = "20px 20px 20px 20px";
    opcionesycolores.innerHTML = '<a class="btn btn-lg" role="button" onclick=borrarLienzo()><img class="aspect" src="img/trash.svg" alt="" style="margin:5px"></a>';
    colores.forEach(cargarColor);
}

function cargarColor(color) {
    if (usuario.colores.includes(color.color)) {
        opcionesycolores.innerHTML += '<a class="btn btn-lg" role="button" onclick=seleccionarColor("' + color.color + '")><img align="left" src="' + color.imagen + '" width="30px"></a>';
    }
}

function seleccionarColor(nuevocolor) {
    color = nuevocolor;
}

var input = document.getElementById("chat-input");

input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    if (input.value != "") {
        mandarMensaje(input.value);
    }
    input.value = "";
  }
});

let lineas = [];
let correccionX = 0;
let correccionY = 0;
let pintarLinea = false;
var color = '0xff000000';

let posicion = lienzo.getBoundingClientRect();
correccionX = posicion.x;
correccionY = posicion.y;

lienzo.width = 600;
lienzo.height = 600;

function empezarDibujo() {
    pintarLinea = true;
    lineas.push([]);
    console.log('Pintamos');
    if (lineas.length == 0) {
        pintarLinea = false;
    }
}

function dibujarLinea (evento) {
    evento.preventDefault();
    if (pintarLinea) {
        var ctx = lienzo.getContext('2d');
        // Estilo de la linea
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;

        let nuevaPosicionX = 0;
        let nuevaPosicionY = 0;
        if (evento.changedTouches == undefined) {
            nuevaPosicionX = evento.layerX;
            nuevaPosicionY = evento.layerY;
        }
        else {
            nuevaPosicionX = evento.changedTouches[0].pageX - correccionX;
            nuevaPosicionY = evento.changedTouches[0].pageY - correccionY;
        }
        // Guardamos la linea
        lineas[lineas.length - 1].push({
            x: nuevaPosicionX / 1.7 + 0.000001,
            y: nuevaPosicionY / 1.7 + 0.000001,
            color: color,
        });
        // Redibujamos todas las lineas guardadas
        lineas.forEach(function (segmento) {
            ctx.beginPath();
            ctx.moveTo(segmento[0].x * 1.7, segmento[0].y * 1.7);
            segmento.forEach(function (punto, index) {
                if (punto.color == null) {
                    //console.log('x: ' + punto.x + ' y: ' + punto.y);
                }
                else {
                    // Color de la linea
                    ctx.strokeStyle = '#' + punto.color.substring(punto.color.length - 6);
                    ctx.lineTo(punto.x * 1.7, punto.y * 1.7);
                }
            });
        });
        ctx.stroke();
    }
}

var separador = -1;

function dejarDibujo() {
    pintarLinea = false;
    console.log('Dejamos de pintar');
    lineas[lineas.length - 1].push({
        x: separador,
        y: separador,
        color: null,
    });
    separador = separador - 1;
    lineas.forEach(function(linea) {
        //console.log(linea);
        firestore.collection('partidas').doc(partidaActual.id).update({
            puntos: firebase.firestore.FieldValue.arrayUnion.apply(null, linea),
        });
    });

}

function borrarLienzo() {
    firestore.collection('partidas').doc(partidaActual.id).update({
        puntos: [],
    });
    lineas = [];
    let ctx = lienzo.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, 600, 600);
    ctx.stroke();
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

var palabras = [
    {text: 'manzana', value: '1',},
    {text: 'pera', value: '2',},
    {text: 'melocoton', value: '3',},
    {text: 'sandia', value: '4',},
    {text: 'melon', value: '5',},
    {text: 'Apple', value: '6',},
    {text: 'Microsoft', value: '7',},
    {text: 'Google', value: '8',},
    {text: 'Unizar', value: '9',},
    {text: 'dibujillo', value: '10',},];

function randomNum(min, max) {
    var n = [];
    var nums = [];
    for(var i=0;i<3;i++){
        var aux = Math.floor(Math.random() * max) + min;
        while(nums.includes(aux)) {
            aux = Math.floor(Math.random() * max) + min;
        }
        nums[i] = aux;
        n.push(palabras[nums[i]]);
    }
    return n;
}

var palabrasElegidas;

async function elegirPalabra(recargar){
    if (recargar) {
        palabrasElegidas = randomNum(0, 9);
    }
    await bootbox.prompt({
        title: "Elige una palabra:",
        inputType: 'radio',
        inputOptions: palabrasElegidas,
        required: true,
        closeButton: false,
        onEscape: false,
        callback: function (result) {
            if (result == undefined) {
                elegirPalabra(false);
            }
            else {
                console.log('Palabra elegida' + palabras[result - 1]);
                firestore.collection('partidas').doc(partidaActual.id).update({
                    palabra: palabras[result - 1].text,
                });
                cuentaAtrasEleccion(true);
            }
        }
    });
}
//---------------------------------------------------
// Llamada a funciones generales al cargar la paguina
//---------------------------------------------------

escucharAuthentication();

