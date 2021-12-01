const functions = require('firebase-functions');
const express = require('express');
const YahooFantasy = require('yahoo-fantasy');
const client = require('core-js');

// const cors = require('cors');

// CORS
// const api = express().use(cors);
const api = express();


api.get('/', (req, res) => {
  // res.status(201).send();
  res.send('custom firebase function');
});

// YAHOO
const tokenCallback = function({access_token, refresh_token}, client) {
  return new Promise((resolve, reject) => {
    // client is redis client
    client.set('accessToken', access_token, (err, res) => {
      // could probably handle this with a multi...
      // and you know... handle the errors...
      // good thing this is only an example!
      client.set('accessToken', access_token, (err, res) => {
        return resolve();
      });
    });
  });
};

const key = 'dj0yJmk9WWVqS1lwbWxyOGhhJmQ9WVdrOWFXMXFOMXBqZDBZbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWQ1';
const sec = '5cd4373780f1bb59a0ea4f1246509bcc4e94e604';

api.yf = new YahooFantasy(
    key,
    sec,
    tokenCallback,
    'https://projectbluefire.com/auth/yahoo/callback'
);

api.get('/auth/yahoo', (req, res) => api.yf.auth(res));

api.get('/auth/yahoo/callback', (req, res) => {
  api.yf.authCallback(req, (err) => {
    if (err) {
      return res.redirect('/error');
    }

    return res.redirect('/');
  });
});

api.get('/test', (req, res) => {
  res.send('it works!');
});

exports.base = functions.https.onRequest(api);


// http://localhost:5001/project-bluefire/us-central1/yahooAuth
