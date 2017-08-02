const firebase = require('firebase-admin')
const path = require('path')
const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const YouTube = require('youtube-node');


const serviceAccount = require(path.resolve(__dirname, '..', 'auth', 'firebase.json'));
const app = firebase.initializeApp({
  // Setup service account for this app.
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://music-games.firebaseio.com',
})
const db = app.database()
const questionsRef = db.ref('questions')
const usersRef = db.ref('users')
const youTube = new YouTube();

youTube.setKey('AIzaSyADtiS-UxkTMe6kpI920BURFww51d2YZY8');

youTube.search('World War z Trailer', 2, function(error, result) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(result, null, 2));
  }
});
