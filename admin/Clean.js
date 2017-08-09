const _ = require('lodash')
const fs = require('fs')


const db = JSON.parse(fs.readFileSync('./data/music-games-export.json', 'utf-8'))
var questions = db.questions
var users = db.users

clean()
setupNewStructure()
cleanResponsesQ()
setupReveal()

const newDB = {
  questions: questions,
  users: users
}
fs.writeFileSync('./data/edited.json', JSON.stringify(newDB, null, 2) , 'utf-8')

function clean () {
  Object.keys(questions).forEach((qk) => {
    questions[qk].numRevealed = 0
    questions[qk].timeToCorrectRespTotal = 0
    questions[qk].totalGuessTime = 0
  })
  Object.keys(users).forEach((uk) => {
    users[uk].numCorrect = 0
    users[uk].numGuesses = 0
    users[uk].score = 0
    users[uk].totalGuessTime = 0
    if (!users[uk].responses) {
      // no responses from user
    } else {
      Object.keys(questions).forEach((qk) => {
        if(!users[uk].responses[qk]) {
          // user haven't revealed the question
        } else {
          users[uk].responses[qk].numGuesses = 0
          users[uk].responses[qk].status = 'pending'
          delete users[uk].responses[qk].lastUpdateTime
        }
      })
    }
  })
}

function setupNewStructure() {
  Object.keys(questions).forEach((qk) => {
    questions[qk]['viewedUsers'] = {}
  })
}

function setupReveal() {
  Object.keys(users).forEach((uk) => {
    Object.keys(users[uk].responses).forEach((qk) => {
      if (!questions[qk]) {
        // question doesn't exist
      } else {
        questions[qk].viewedUsers[uk] = true
        questions[qk].numRevealed++
      }
    })
  })
}

function cleanResponsesQ() {
  Object.keys(questions).forEach((qk) => {
    let sortedResponses = _.sortBy(questions[qk].responses, (r) => {
      return r.timestamp
    })
    sortedResponses.forEach((r) => {
      let revealTime = users[r.username].responses[qk].revealTime
      let answerTime = r.timestamp - revealTime

      questions[qk].totalGuessTime += answerTime
      users[r.username].numGuesses++
      users[r.username].responses[qk].numGuesses++
      users[r.username].totalGuessTime += answerTime
      if (r.status === 'correct') {
        questions[qk].timeToCorrectRespTotal += answerTime
        users[r.username].numCorrect++
        if (users[r.username].responses[qk].status !== 'correct') {
          users[r.username].responses[qk].status = 'correct'
          users[r.username].score += questions[qk].points
        }
      }
    })
  })
}
