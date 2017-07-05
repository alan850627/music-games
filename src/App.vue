<template>
  <div id="app">
    <img src="./assets/logo.png" height="150px">
    <div>
      <h1>Unsolved</h1>
      <span v-for="question in unsolvedQuestions">
        <question></question>
      </span>
    </div>
    <div>
      <h1>Solved</h1>
      <span v-for="question in solvedQuestions">
        <question></question>
      </span>
    </div>
  </div>
</template>

<script>
  import Question from './components/Question'

  // This line is new!
  import Firebase from 'firebase'

  // Initialize Firebase
  let config = {
    apiKey: 'AIzaSyDm4x3mKWK4tAnKQlrsE8MaQgjZeSWvOCQ',
    authDomain: 'music-games.firebaseapp.com',
    databaseURL: 'https://music-games.firebaseio.com',
    projectId: 'music-games',
    storageBucket: 'music-games.appspot.com',
    messagingSenderId: '792809265103'
  }

  // Here we are initializing the Firebase connection.
  let app = Firebase.initializeApp(config)
  let db = app.database()

  // Accessing the greetings reference; .ref() takes a URL as its parameter.
  let questionsRef = db.ref('questions')
  let playersRef = db.ref('players')

  export default {
    name: 'app',

    components: {
      Question
    },

    firebase: {
      questions: questionsRef.orderByKey(),
      players: playersRef.orderByKey()
    },

    computed: {
      solvedQuestions: function () {
        return this.questions.filter((question) => {
          return question.solved === true
        })
      },
      unsolvedQuestions: function () {
        return this.questions.filter((question) => {
          return question.solved === false
        })
      }
    },

    data () {
      return {
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
  }
</style>
