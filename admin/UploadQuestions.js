const firebase = require('firebase-admin')
const path = require('path')
const prompt = require('prompt')
const fs = require('fs')
const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const schema = {
  properties: {
    questionFile: {
      description: 'Relative path to your question json file',
      required: true
    }
  }
}

const serviceAccount = require(path.resolve(__dirname, '..', 'auth', 'firebase.json'));
const app = firebase.initializeApp({
  // Setup service account for this app.
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://music-games.firebaseio.com',
})
const db = app.database()
const questionsRef = db.ref('questions')

prompt.start()
prompt.get(schema, (err, result) => {
  let file = JSON.parse(fs.readFileSync(path.resolve(__dirname, result.questionFile), 'utf8'))

  for (let key in file) {
    let question = {
      link: file[key].link,
      solution: file[key].solution,
      description: file[key].description,
      points: file[key].points,
      expireDuration: file[key].expireHours * 60 * 60 * 1000,
      createdTime: Date.now(),
      responses: {},
      numRevealed: 0,
      totalGuessTime: 0,
      id: uuidv4(),
      op: 'alanolen',
      timeToCorrectRespTotal: 0
    }
    console.log(`Uploading ${key}...`)
    questionsRef.push().update(question)
  }
})
