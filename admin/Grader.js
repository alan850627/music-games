const firebase = require('firebase-admin')
const path = require('path')
const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const YouTube = require('youtube-node');
const fs = require('fs')


const serviceAccount = require(path.resolve(__dirname, '..', 'auth', 'firebase.json'));
const app = firebase.initializeApp({
  // Setup service account for this app.
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://music-games.firebaseio.com',
})
const db = app.database()
const questionsRef = db.ref('questions')
const usersRef = db.ref('users')
const youTube = new YouTube()
youTube.setKey('AIzaSyADtiS-UxkTMe6kpI920BURFww51d2YZY8');

console.log('*DEBUG* Loading correct Answers from file')
let correctAnswers = JSON.parse(fs.readFileSync('./admin/data.json', 'utf8'));
let questions = {}

questionsRef.on("child_added", function(question, prevChildKey) {
  //TODO NEED TO FIND THE QUESTIONS WITH PENDING RESPONSES ONLY
  let pendingq = _.filter(question.val().responses, (res) => {
    return res.status === "pending"
  })
  questions[question.key] = question.val()
  if (pendingq.length > 0 || !correctAnswers[question.key]) {
    youTube.search(question.val().solution, 10, function(error, result) {
      if (error) {
        console.log(error)
      } else {
        correctAnswers[question.key] = result.items.map((vid) => {
          return vid.id.videoId
        })
        fs.writeFileSync('./admin/data.json', JSON.stringify(correctAnswers, null, 2) , 'utf-8')
        console.log(`*DEBUG* Sourcing from Youtube for: ${question.val().solution}`)
        console.log(JSON.stringify(correctAnswers[question.key], null, 2))
      }
    })
  }

  setTimeout(function () {
    questionsRef.child(`${question.key}/responses`).on("child_added", function(response, prevChildKey) {
      // Grade
      if (response.val().status === "pending") {
        let ansVids = correctAnswers[response.val().questionId]
        let respVids
        youTube.search(response.val().response, 10, function(error, result) {
          if (error) {
            console.log(error)
          } else {
            respVids = result.items.map((vid) => {
              return vid.id.videoId
            })

            // Now compare if ansVids AND respVids have anything in common
            let common = compareTwoArraysIgnoreNull(ansVids, respVids)
            if (common) {
              // answer correct!
              console.log('\n')
              console.log(`Grading \"${questions[response.val().questionId].solution}\":`)
              console.log(`${response.val().username} answered \"${response.val().response}\"`)
              console.log('CORRECT!')
              let ref = usersRef.child(`${response.val().username}`)
              ref.once('value').then((snapshot) => {
                let up = {
                  'numCorrect': snapshot.val().numCorrect + 1,
                  'score': snapshot.val().score + questions[response.val().questionId].points
                }
                ref.update(up)

                // track average time it takes ot get question correct
                questionsRef.child(`${response.val().questionId}`).once('value').then((qsnapshot) => {
                  questionsRef.child(`${response.val().questionId}`).update({
                    'timeToCorrectRespTotal': qsnapshot.val().timeToCorrectRespTotal + response.val().timestamp - snapshot.val().responses[response.val().questionId].revealTime
                  })
                })
              })

              questionsRef.child(`${response.val().questionId}/responses/${response.key}`).update({
                'status': 'correct'
              })
              ref.child(`responses/${response.val().questionId}`).update({
                'status': 'correct'
              })
            } else {
              // answer incorrect
              console.log('\n')
              console.log(`Grading \"${questions[response.val().questionId].solution}\":`)
              console.log(`${response.val().username} answered \"${response.val().response}\"`)
              console.log('INCORRECT!')
              questionsRef.child(`${response.val().questionId}/responses/${response.key}`).update({
                'status': 'incorrect'
              })
              usersRef.child(`${response.val().username}/responses/${response.val().questionId}`).update({
                'status': 'incorrect'
              })
            }
          }
        })
      }
    })
    console.log(`*DEBUG* ${question.val().solution} READY`)
  }, 10000);
})

function compareTwoArraysIgnoreNull(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i]) {
      for (let j = 0; j < arr2.length; j++) {
        if (arr2[j]) {
          if (arr1[i] === arr2[j]) {
            return true
          }
        }
      }
    }
  }
  return false
}
