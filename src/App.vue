<template>
  <div id="app">
    <md-card md-theme="green">
      <md-card-header>
        <md-layout md-row>
          <img src="./assets/logo.png" />
          <md-layout md-column>
            <div class="md-title">Music Games</div>
            <div class="md-subheading">Alan's game for /r/classicalmusic</div>
          </md-layout>
        </md-layout>
      </md-card-header>
    </md-card>
    <div>
      <h1>Open</h1>
      <span v-for="q in openQuestions">
        <question
          :link="q.link"
          :solution="q.solution"
          :category="q.category"
          :points="q.points"
          :expireTime="q.expireTime"
          :responses="q.responses"
          :user="username">
        </question>
      </span>
    </div>
    <div>
      <h1>Closed</h1>
      <span v-for="question in closedQuestions">
        <question
          :link="q.link"
          :solution="q.solution"
          :category="q.category"
          :points="q.points"
          :expireTime="q.expireTime"
          :responses="q.responses">
        </question>
      </span>
    </div>

    <md-dialog-prompt
      md-title="Username"
      md-ok-text="Ok"
      md-cancel-text="prompt.cancel"
      @open="onOpen"
      @close="onClose"
      v-model="username"
      ref="dialogUsername">
    </md-dialog-prompt>
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
  const app = Firebase.initializeApp(config)

  // Accessing the data reference
  const db = app.database()
  const questionsRef = db.ref('questions')
  const playersRef = db.ref('players')

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
        username: ''
      }
    },

    methods: {
      login: (email, password) => {
        Firebase.auth().signInWithEmailAndPassword(email, password).catch((err) => {
          console.err(err.message)
        })
      },
      fetchUsers: () => {

      },
      openDialog (ref) {
        this.$refs[ref].open()
      },
      closeDialog (ref) {
        this.$refs[ref].close()
      },
      onOpen () {
        console.log('Opened')
      },
      onClose (type) {
        console.log('Closed', type)
      }
    },

    mounted () {
      this.login('default@gmail.com', 'password')
      this.openDialog('dialogUsername')
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
