const express = require('express');
const cors = require('cors');


// CORS
const api = express().use(cors( { origin: true } ));

// api.use(cors({origin: true}));

api.get('/', (req, res) => {
  // res.status(201).send();
  res.send('custom firebase function');
});

api.get('/test', (req, res) => {
  console.log('running test....')
  res.send('test url... it works!');
});
