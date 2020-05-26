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
{nombre:"Dibujillo", color:"0xFF00E676", imagen:"img/colores/dibujillo.png"},
{nombre:"Mandarina", color:"0xFFFFAB40", imagen:"img/colores/mandarina.png"},
{nombre:"Oceano", color:"0xFF3F51B5", imagen:"img/colores/oceano.png"},
{nombre:"Bosque", color:"0xFF009688", imagen:"img/colores/bosque.png"},
{nombre:"Salmon", color:"0xFFFA8072", imagen:"img/colores/salmon.png"}
];


var listaJugadores = document.getElementById('listaJugadores');
//var lienzo = document.getElementById('canvas');
var lienzo = document.getElementById("canvas");
var chat = document.getElementById("chat");
var palabraHint = document.getElementById('palabra');
var imagenPause = document.getElementById('imagePause');

var partidaActual;
var estado = 0;
var numeroAciertos = 0;
var palabrahint;

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
    quitarDialog();
    lienzo.removeEventListener('mousedown', empezarDibujo, false);
    lienzo.removeEventListener('mousemove', dibujarLinea, false);
    lienzo.removeEventListener('mouseup', dejarDibujo, false);
    document.getElementById("chat-input").disabled = false;
    if (partidaActual.activos < 2) {
        console.log('Esperando jugadores');
        opcionesycolores.innerHTML = '';
        mostrarEsperandoJugadores();
        estado = 0;
    }
    else {
        if (partidaActual.ronda >= 4) {
            console.log('Fin partida');
            window.location.replace('finPartida.html?ref=' + partidaActual.id);
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
                    contadorEleccion = 0;
                    cuentaAtrasEleccion(true);
                    if (!cuentaAtrasActivada) {
                        borrarLienzoLocal();
                        contador = 30;
                        cuentaAtras(false);
                    }
                    cargarOpciones();
                    lienzo.addEventListener('mousedown', empezarDibujo, false);
                    lienzo.addEventListener('mousemove', dibujarLinea, false);
                    lienzo.addEventListener('mouseup', dejarDibujo, false);

                    document.getElementById("chat-input").disabled = true;

                    //lienzo.addEventListener('touchstart', empezarDibujo, false);
                    //lienzo.addEventListener('touchmove', dibujarLinea, false);

                    estado = 3;
                }
            }
            else {
                if (partidaActual.palabra == "") {
                    console.log('Toca esperar que elijan palabra');
                    opcionesycolores.innerHTML = '';
                    contadorEleccion = 0;
                    cuentaAtrasEleccion(true);
                    contador = 0;
                    cuentaAtras(true);
                    mostrarEsperandoPalabra();
                    estado = 4;
                }
                else {
                    console.log('Toca adivinar');
                    opcionesycolores.innerHTML = '';
                    contadorEleccion = 0;
                    cuentaAtrasEleccion(true);
                    if (!cuentaAtrasActivada) {
                        borrarLienzoLocal();
                        contador = 30;
                        cuentaAtras(false);
                    }
                    estado = 5;
                }
            }
            if (partidaActual.nAciertos == partidaActual.jugadores.length - 1) {
                contador = 0;
            }
            var numComprobados = 0;
            while(numComprobados < partidaActual.jugadores.length) {
                if (partidaActual.jugadores[numComprobados].email == usuario.email) {
                    if (partidaActual.jugadores[numComprobados].pause) {
                        imagenPause.innerHTML = '<img title="Vuelve a la partida" style="width:50px; height:50px;"src="img/play.png" onclick="pausar()">';
                    }
                    else {
                        imagenPause.innerHTML = '<img title="Pausa la partida para que salte tu turno si no estás jugando" style="width:50px; height:50px;"src="img/pausa.png" onclick="pausar()">';
                    }
                }
                numComprobados++;
            }
        }
    }
    calcularPalabra();
}

function pasarTurno() {
    var partidaRef = firestore.collection("partidas").doc(partidaActual.id);
    firestore.runTransaction(function(transaction) {
        return transaction.get(partidaRef).then(function(sfDoc) {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var jugadores = sfDoc.data().jugadores;
            var numJugadores = jugadores.length;
            var anterior = sfDoc.data().turno;
            var turno = (anterior + 1) % numJugadores;
            var ronda = sfDoc.data().ronda;
            var saveRonda = ronda;

            var numComprobados = 0;
            while (numComprobados < numJugadores) {
                if (jugadores[turno].pause) {
                    turno = (turno + 1) % numJugadores;
                    if (ronda == saveRonda && turno <= anterior) {
                        ronda++;
                    }
                }
                else {
                    numComprobados = numJugadores;
                }
            }

            if (ronda == saveRonda && turno <= anterior) {
                ronda++;
            }

            transaction.update(partidaRef, {
                turno: turno,
                ronda: ronda,
                palabra: '',
                activos: numJugadores,
                puntos: [],
                chat: [],
                nAciertos: 0,
            });
            return "";
        });
    }).catch(function(err) {
        console.error(err);
    });
    borrarLienzo();
}

function pausar() {
    var partidaRef = firestore.collection("partidas").doc(partidaActual.id);
    firestore.runTransaction(function(transaction) {
        return transaction.get(partidaRef).then(function(sfDoc) {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var jugadores = sfDoc.data().jugadores;
            var numJugadores = jugadores.length;
            var newJugadores = [];

            var numComprobados = 0;
            while (numComprobados < numJugadores) {
                if (jugadores[numComprobados].email == usuario.email) {
                    newJugadores.push(
                        {
                            apodo: jugadores[numComprobados].apodo,
                            email: jugadores[numComprobados].email,
                            photoUrl: jugadores[numComprobados].photoUrl,
                            score: jugadores[numComprobados].score,
                            pause: !jugadores[numComprobados].pause,
                        }
                    );
                }
                else {
                    newJugadores.push(
                        {
                            apodo: jugadores[numComprobados].apodo,
                            email: jugadores[numComprobados].email,
                            photoUrl: jugadores[numComprobados].photoUrl,
                            score: jugadores[numComprobados].score,
                            pause: jugadores[numComprobados].pause,
                        }
                    );
                }
                numComprobados++;
            }

            transaction.update(partidaRef, {
                jugadores: newJugadores,
            });
            return "";
        });
    }).catch(function(err) {
        console.error(err);
    });
}

function actualizarJugadores(jugador) {
    if (partidaActual.jugadores[partidaActual.turno].email == usuario.email) {
        listaJugadores.innerHTML += '<tr><td><img class="aspect" src="' + jugador.photoUrl + '" alt=""><a class="user-link" style="font-weight: 600;">' + jugador.apodo + '</a></td><td>' + jugador.score + '</td></tr>';
    }
    else {
        listaJugadores.innerHTML += '<tr><td><img class="aspect" src="' + jugador.photoUrl + '" alt=""><a class="user-link">' + jugador.apodo + '</a></td><td>' + jugador.score + '</td></tr>';
    }

}

function actualizarChat(mensaje) {
    if (mensaje.contenido.toLowerCase().trim() == partidaActual.palabra.toLowerCase().trim()) {
        chat.innerHTML += '<li><span class="chat-row-apodo">' + mensaje.usuario.apodo + '</span><span> ha acertado</span></li>';
    }
    else {
        chat.innerHTML += '<li><span class="chat-row-apodo">' + mensaje.usuario.apodo + '</span><span>' + mensaje.contenido + '</span></li>';
    }

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
    var aciertos = 0;
    if (mensaje.toLowerCase().trim() == partidaActual.palabra.toLowerCase().trim()) {
        aciertos = 1;
    }
    var j = 0;
    var nuevosJugadores = [];
    while (j < partidaActual.jugadores.length) {
        var puntuacion = 0;
        if (partidaActual.jugadores[j].email == usuario.email && aciertos == 1) {
            puntuacion = partidaActual.jugadores[j].score;
            if (contador > 50) {
                puntuacion += 25;
            } else if (contador > 35) {
                puntuacion += 15;
            } else if (contador > 15) {
                puntuacion += 10;
            } else {
                puntuacion += 5;
            }
        }
        else {
            puntuacion = partidaActual.jugadores[j].score;
        }
        nuevosJugadores.push(
            {
                apodo: partidaActual.jugadores[j].apodo,
                email: partidaActual.jugadores[j].email,
                photoUrl: partidaActual.jugadores[j].photoUrl,
                score: puntuacion,
                pause: partidaActual.jugadores[j].pause,
            }
        );
        j++;
    }
    var timestamp = firebase.firestore.Timestamp.fromDate(new Date());
    firestore.collection('partidas').doc(partidaActual.id).update({
        chat: firebase.firestore.FieldValue.arrayUnion({
            contenido: mensaje,
            timestamp: timestamp,
            usuario: usuario,
        }),
        nAciertos: firebase.firestore.FieldValue.increment(aciertos),
        jugadores: nuevosJugadores,
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
        timerCounter.innerHTML = '<h3 align="center" style="padding: 10px;">Contador: ' + contador + '</h3>';
    }
    else {
        cuentaAtrasActivada = true;
        timerCounter.innerHTML = '<h3 align="center" style="padding: 10px;">Contador: ' + contador + '</h3>';
        if (contador > 0) {
            contador -= 1;
            setTimeout("cuentaAtras()", 1000);
            if (contador == 14) {
                darPista = true;
                calcularPalabra();
            }
        }
        else {
            if (cuentaAtrasActivada) {

                mostrarFinTurno();

                cuentaAtrasActivada = false;
            }
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

var darPista = false;

function calcularPalabra() {
    if (estado == 3) {
        palabraHint.innerHTML = '<h2 align="center" style="padding: 5px 5px;">' + partidaActual.palabra + '</h2>';
    }
    else if (estado == 5) {
        var hint = '';
        var npista = Math.floor(Math.random() * partidaActual.palabra.length - 1);
        for (var i = 0; i < partidaActual.palabra.length; i++) {
            if (darPista && i == npista) {
                hint += partidaActual.palabra[i] + ' ';
                darPista = false;
            }
            else {
                hint += '_ ';
            }
        }
        palabraHint.innerHTML = '<h2 align="center" style="padding: 5px 5px;">' + hint + '</h2>';
    }
    else {
        palabraHint.innerHTML = '<h2 align="center" style="padding: 5px 5px;">Dibujillo</h2>';
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
        opcionesycolores.innerHTML += '<a class="btn btn-lg" role="button" onclick=seleccionarColor("' + color.color + '")><div style="margin: 0; position: relative; top: 50%; -ms-transform: translateY(-50%);transform: translateY(-50%);"><img align="center" src="' + color.imagen + '" width="30px"></div></a>';
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
    borrarLienzoLocal();
}

function borrarLienzoLocal() {
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
    {text: 'melocotón', value: '3',},
    {text: 'sandía', value: '4',},
    {text: 'melón', value: '5',},
    {text: 'Apple', value: '6',},
    {text: 'Microsoft', value: '7',},
    {text: 'Google', value: '8',},
    {text: 'Unizar', value: '9',},
    {text: 'plátano', value: '10',},
	{text: 'dibujillo', value: '11',},
	{text: 'camiseta', value: '12',},
	{text: 'chaqueta', value: '13',},
	{text: 'agua', value: '14',},
	{text: 'leche', value: '15',},
	{text: 'árbol', value: '16',},
	{text: 'examen', value: '17',},
	{text: 'mesa', value: '18',},
	{text: 'estudiar', value: '19',},
	{text: 'cuaderno', value: '20',},
	{text: 'zaragoza', value: '21',},
	{text: 'logroño', value: '22',},
	{text: 'huesca', value: '23',},
	{text: 'teruel', value: '24',},
	{text: 'pelo', value: '25',},
	{text: 'cabeza', value: '26',},
	{text: 'fútbol', value: '27',},
	{text: 'baloncesto', value: '28',},
	{text: 'natación', value: '29',},
	{text: 'bolsa', value: '30',},
	{text: 'mochila', value: '31',},
	{text: 'ordenador', value: '32',},
	{text: 'móvil', value: '33',},
	{text: 'calendario', value: '34',},
	{text: 'estuche', value: '35',},
	{text: 'falda', value: '36',},
	{text: 'teclado', value: '37',},
	{text: 'universidad', value: '38',},
	{text: 'sobresaliente', value: '39',}
	];

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

var dialog;

function mostrarEsperandoJugadores() {
    dialog = bootbox.dialog({
        message: '<div class="row justify-content-center"><div class="spinner-grow text-success" role="status"></div><div class="text-center" style="margin: 5px 20px">Esperando jugadores...</div></div>',
        closeButton: false,
        onEscape: true,
    });
}

function mostrarEsperandoPalabra() {
    dialog = bootbox.dialog({
        message: '<div class="row justify-content-center"><div class="spinner-grow text-success" role="status"></div><div class="text-center" style="margin: 5px 20px">' + partidaActual.jugadores[partidaActual.turno].apodo + ' está eligiendo palabra...</div></div>',
        closeButton: false,
        onEscape: true,
    });
}

function mostrarFinTurno() {
    var puntuaciones = '<table class="table user-list"><tbody>';
    var players = partidaActual.jugadores;
    var jug;
    for (jug in players) {
        puntuaciones += '<tr><td><img class="aspect" src="' + players[jug].photoUrl + '" alt=""><a class="user-link">' + players[jug].apodo + '</a></td><td>' + players[jug].score + ' puntos</td></tr>';
    }
    puntuaciones += '</tbody></table>';
    if (usuario.email == partidaActual.jugadores[partidaActual.turno].email) {
        dialog = bootbox.dialog({
            title: 'Fin del turno',
            message: puntuaciones,
            size: 'large',
            closeButton: false,
            onEscape: false,
            buttons: {
                fee: {
                    label: 'Siguiente turno',
                    className: 'btn-success',
                    callback: function(){
                        pasarTurno();
                    }
                },
            }
        });
    }
    else {
        dialog = bootbox.dialog({
            title: 'Fin del turno',
            message: puntuaciones,
            size: 'large',
            closeButton: false,
            onEscape: true,
        });
    }

}

function quitarDialog() {
    bootbox.hideAll();
}
//---------------------------------------------------
// Llamada a funciones generales al cargar la paguina
//---------------------------------------------------

escucharAuthentication();

