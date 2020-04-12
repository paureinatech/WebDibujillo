
var firestore = firebase.firestore();

var email = document.getElementById('email');
var password = document.getElementById('password');
var signInButton = document.getElementById('signInButton');

async function signIn() {

    if (!validateForm()) {
        return;
    }
    else {
      console.log('Logueando...');
    }

    var result = true;

    await firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Error al iniciar sesion');
      console.log(errorMessage);
      // ...
      result = false;
    });
    if (result == true) {
        console.log('Sesion iniciada con exito');
        window.location.replace("juegos.html");
    }
    else {
        console.log('No se ha podido iniciar sesion');
        document.signInForm.password.focus();
    }

    return result;
}

function validateForm() {
    console.log('Comprobando campos');
    if (document.signInForm.email.value == "") {
        alert("Por favor introduzca su email");
        document.signInForm.email.focus();
        return false;
    }
    if (document.signInForm.password.value == "") {
        alert("Por favor introduzca su contraseña");
        document.signInForm.password.focus();
        return false;
    }
    //console.log(document.signInForm.email)
    return ( true );
}

escucharAuthentication();