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

var email = "jorgeiliarte15@gmail.com";
var password = "123456";

// main.js:
const signIn = require('../js/index.js').signIn;
signIn();

// main.js:
//const myModule = require('./myModule.js');
//myModule.logSomething('hello');
//myModule.doSomethingElse('something else');