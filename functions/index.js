const functions = require('firebase-functions');
const express = require('express');
const YahooFantasy = require('yahoo-fantasy');
// const client = require('core-js');
const cors = require('cors');
// const { client } = require('core-js');
const { request } = require('express');

// CORS
const api = express().use(cors( { origin: true } ));
// const api = express();

// api.use(cors({origin: true}));

api.get('/', (req, res) => {
  // res.status(201).send();
  res.send('custom firebase function');
});

api.get('/test', (req, res) => {
  console.log('running test....')
  res.send('test url... it works!');
});


// YAHOO
// const tokenCallback = function({access_token, refresh_token}) {
//   return new Promise((resolve, reject) => {
//     // client is redis client
//     client.set('accessToken', access_token, (err, res) => {
//       // could probably handle this with a multi...
//       // and you know... handle the errors...
//       // good thing this is only an example!
//       client.set('accessToken', access_token, (err, res) => {
//         return resolve();
//       });
//     });
//   });
// };

api.tokenCallback = function ({ access_token, refresh_token }) {
  return new Promise((resolve, reject) => {
    // console.log('PERSIST ACCESS TOKEN', access_token);
    // console.log('PERSIST REFRESH TOKEN', refresh_token);

    const options = {
      url: 'https://api.login.yahoo.com/openid/v1/userinfo',
      method: 'get',
      json: true,
      auth: {
        bearer: access_token,
      },
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        api.user = {
          id: body.sub,
          name: body.nickname,
          avatar: body.profile_images.image64,
          accessToken: access_token,
          refreshToken: refresh_token,
        };

        return resolve();
      }
    });
  });
};


// eslint-disable-next-line max-len
const key = 'dj0yJmk9WWVqS1lwbWxyOGhhJmQ9WVdrOWFXMXFOMXBqZDBZbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWQ1';
const sec = '5cd4373780f1bb59a0ea4f1246509bcc4e94e604';

// const baseURL = process.env.NODE_ENV === 'development'
//   ? 'http://localhost:5001/project-bluefire/us-central1/base'
//   : 'https://us-central1-project-bluefire.cloudfunctions.net/base'
//
// api.yf = new YahooFantasy(
//   key,
//   sec,
//   api.tokenCallback,
//   `${baseURL}/auth/yahoo/callback`
// );

api.yf = new YahooFantasy(
    key,
    sec,
    api.tokenCallback,
    'https://projectbluefire.com/auth/yahoo/callback'
);
//
api.get('/auth/yahoo', (req, res) => {
  console.log('in the getter')
  api.yf.auth(res)
});
//
api.get('/auth/yahoo/callback', (req, res) => {
  console.log('in callback! ')
  api.yf.authCallback(req, (err) => {
    if (err) {
      return res.redirect('/error');
    }

    return res.redirect('/');
  });
});


exports.base = functions.https.onRequest(api);


// http://localhost:5001/project-bluefire/us-central1/yahooAuth
// http://localhost:5001/project-bluefire/us-central1/base
