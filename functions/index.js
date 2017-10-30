const firebase = require('firebase-admin')
const functions = require('firebase-functions')
const path = require('path')
const _ = require('lodash')
const YouTube = require('youtube-node')
const fs = require('fs')


const app = firebase.initializeApp(functions.config().firebase)
const db = app.database()
const questionsRef = db.ref('questions')
const usersRef = db.ref('users')
const youTube = new YouTube()
youTube.setKey('AIzaSyADtiS-UxkTMe6kpI920BURFww51d2YZY8');

exports.grader = functions.database.ref(`questions/{qid}/responses/{rid}`).onCreate(event => {
	console.log(event.data.val())
	console.log(event.data.key)
	response = event.data.val()
	key = event.data.key
	if (response && key) {
		grade(response, key);
	}
})

function grade(res, rkey) {
	console.log(`Grading ${res.username}'s response: ${res.response}`)

	// 1) Get the correct answer
	questionsRef.child(`${res.questionId}`).once('value').then((qsnapshot) => {

    // 2) Search correct youtube list
    youTube.search(qsnapshot.val().solution, 10, function(error, solution_result) {
    	if (error) {
        console.log(error)
      } else {
        solution_result = solution_result.items.map((vid) => {
          return vid.id.videoId
        })
      }

      // 3) Search input youtube list
      youTube.search(res.response, 10, function(error, input_result) {
      	if (error) {
	        console.log(error)
	      } else {
	        input_result = input_result.items.map((vid) => {
	          return vid.id.videoId
	        })
	      }

	      // 4) Compare two lists
	      let common = compareTwoArraysIgnoreNull(input_result, solution_result)
	      if (common) {
	      	correct(res, rkey, qsnapshot.val())
	      } else {
	      	incorrect(res, rkey, qsnapshot.val())
	      }
      })
    })
  })
}

function correct(res, rkey, q) {
	console.log('Correct!')
	let ref = usersRef.child(`${res.username}`)
  ref.once('value').then((snapshot) => {
    let up = {}
    if (snapshot.val().responses[res.questionId].status === 'correct') {
      // Don't increment score if user already got the question correct but answered twice.
      up = {
        'numCorrect': snapshot.val().numCorrect + 1
      }
    } else {
      up = {
        'numCorrect': snapshot.val().numCorrect + 1,
        'score': snapshot.val().score + q.points
      }
    }

    ref.update(up)

    // track average time it takes ot get question correct
    questionsRef.child(`${res.questionId}`).update({
      'timeToCorrectRespTotal': q.timeToCorrectRespTotal + res.timestamp - snapshot.val().responses[res.questionId].revealTime
    })

    questionsRef.child(`${res.questionId}/responses/${rkey}`).update({
      'status': 'correct'
    })
    ref.child(`responses/${res.questionId}`).update({
      'status': 'correct'
    })
  })
}

function incorrect(res, rkey, q) {
	console.log('Incorrect!')
	questionsRef.child(`${res.questionId}/responses/${rkey}`).update({
    'status': 'incorrect'
  })
  let ref = usersRef.child(`${res.username}`)
  ref.once('value').then((snapshot) => {
    if (snapshot.val().responses[`${res.questionId}`].status !== "correct") {
      ref.child(`responses/${res.questionId}`).update({
        'status': 'incorrect'
      })
    }
  })
}

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
