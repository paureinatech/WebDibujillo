// At the top of test/index.test.js
const test = require('firebase-functions-test')({
    databaseURL: 'https://dibujillo.firebaseio.com',
    storageBucket: 'dibujillo.appspot.com',
    projectId: 'dibujillo'
}, '../../dibujillo-a9ae5eb0eef8.json');

function testFunctions() {
    console.log('Test pasado');
}

testFunctions();