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
var storageRef = firebase.storage().ref();

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
		cargarDatos();
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

var nickname = document.getElementById('nickname');
var correo = document.getElementById('correo');
var foto = document.getElementById('foto');

//-------------------------------------------------------------------

// Funciones propias de la pantalla de perfil

//-------------------------------------------------------------------

function cargarDatos(){
	foto.innerHTML = '<div class="row"><div class="col-3"></div><div class="col-6"><label for="file-input"> <img class="aspect" src="' + usuario.photoUrl + '" style="width: 300px; height: 300px;"> </label> </div></div> <div class="row"><div class="col-3"></div><div class="col-6"> <input id="nuevafoto" type="file" /> </div></div></div>';
	nickname.innerHTML = '<input id="nuevoapodo" type="text" class="form-control" value="' + usuario.apodo + '">';
	console.log('hecargado');
	correo.innerHTML = '<input type="text" class="form-control" value="' + usuario.email + '"disabled>';
	
}

function cambiarDatos(){
	var nuevoapodo = document.getElementById('nuevoapodo');
	var newnickname = nuevoapodo.value;
	if (newnickname != "" && newnickname != usuario.apodo){
		firestore.collection('usuarios').doc(usuario.email).update({
			apodo: newnickname,
        });
	}
	var nuevafoto = document.getElementById('nuevafoto');
	var newphoto = nuevafoto.value;
	
	
	if (newphoto != "" && newphoto != usuario.photoUrl){
		// Create a reference to 'perfil_images/newphoto.jpg'
		var newImagesRef = storageRef.child('perfil_images/'+ newphoto);
		var newfile = new File('"' + newphoto + '"','"'+ newImagesRef+ '"');
		ref.put(file).then(function(snapshot) {
			console.log('Uploaded a blob or file!');
		});
		firestore.collection('usuarios').doc(usuario.photoUrl).update({
			photoUrl: newImagesRef,
        });
	}
}



escucharAuthentication();