const functions = require('firebase-functions');

const express = require('express');
// const cors = require('cors');

// CORS
// const api = express().use(cors);
const api = express();


api.get('/', (req, res) => {
  // res.status(201).send();
  res.send('custom firebase function');
});


exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', {structuredData: true});
  response.send('Hello from Firebase!');
});


exports.base = functions.https.onRequest(api);
