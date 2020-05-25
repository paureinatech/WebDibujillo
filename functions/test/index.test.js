// At the top of test/index.test.js
const test = require('firebase-functions-test')({
    databaseURL: 'https://dibujillo.firebaseio.com',
    storageBucket: 'dibujillo.appspot.com',
    projectId: 'dibujillo'
}, '../../dibujillo-a9ae5eb0eef8.json');

const myTest = require('../index.js');

myTest.test();

function validateForm() {
    return true
}

var email = "pruebaTest@gmail.com";
var nickname = "Test";
var password = "1234";

const myRegistro = require('../../public/js/dibujillo/registro.js');
myRegistro.registerIn()