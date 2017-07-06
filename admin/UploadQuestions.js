const firebase = require('firebase-admin')
const path = require('path')
const prompt = require('prompt')
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const _ = require('lodash');
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
    console.log(`Uploading ${key}...`)
    let question = {
      link: file[key].link,
      solution: file[key].solution,
      category: file[key].category,
      points: file[key].points,
      expireTime: file[key].expireHours * 60 * 60 * 1000 + Date.now(),
      id: uuidv4(),
      createdTime: Date.now(),
      responses: {}
    }
    let newQuestionRef = questionsRef.push()
    newQuestionRef.update(question)
  }

  console.log('Upload Complete...')
  process.exit()
})