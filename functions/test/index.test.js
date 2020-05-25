
// At the top of test/index.test.js
const test = require('firebase-functions-test')({
    databaseURL: 'https://dibujillo.firebaseio.com',
    storageBucket: 'dibujillo.appspot.com',
    projectId: 'dibujillo'
}, '../../dibujillo-a9ae5eb0eef8.json');

const myTest = require('../index.js');

myTest.test();

import { test2 } from '../index.js';

test2();
//const myTest2 = require('../../public/js/dibujillo/registro.js');
//const wrapped = test.wrap(myTest2.test());
