<template>
  <div id="app">
    <img src="./assets/logo.png" height="150px">
    <div>
      <h1>Open</h1>
      <span v-for="question in openQuestions">
        <question></question>
      </span>
    </div>
    <div>
      <h1>Closed</h1>
      <span v-for="question in closedQuestions">
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

  // Accessing the data reference
  let db = app.database()
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
      openQuestions: function () {
        return this.questions.filter((question) => {
          return question.expireTime >= Date.now()
        })
      },
      closedQuestions: function () {
        return this.questions.filter((question) => {
          return question.expireTime < Date.now()
        })
      }
    },

    data () {
      return {
      }
    },

    methods: {
      login: (email, password) => {
        Firebase.auth().signInWithEmailAndPassword(email, password).catch((err) => {
          console.err(err.message)
        })
      }
    },

    mounted () {
      this.login('guest@gmail.com', 'password')
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
