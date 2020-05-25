const sinon = require('sinon');

// At the top of test/index.test.js
const test = require('firebase-functions-test')({
    databaseURL: 'https://dibujillo.firebaseio.com',
    storageBucket: 'dibujillo.appspot.com',
    projectId: 'dibujillo'
}, '../../dibujillo-a9ae5eb0eef8.json');

const myTest = require('../index.js');

myTest.test();

//import { Test2 } from '../index.js';
//test2();

adminInitStub = sinon.stub(admin, 'initializeApp');

const myTest2 = require('../../public/js/dibujillo/registro.js');
myTest2.test();
