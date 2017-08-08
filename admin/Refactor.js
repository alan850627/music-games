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

questionsRef.on("child_added", function(question, prevChildKey) {
  usersRef.on("child_added", function(user, prevUserKey) {
    let u = {
      'revealTime': question.val().createdTime,
      'revealed': true,
      'status': 'pending',
      'numGuesses': 0
    }
    usersRef.child(user.key).child('responses').child(question.key).update(u)
  })
})
