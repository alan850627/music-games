<template>
  <div>
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
  </div>
</template>

<script>
import Question from './Question'
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

export default {
  name: 'app',

  components: {
    Question
  },

  props: {
    username: String
  },

  firebase: {
    questions: questionsRef.orderByKey()
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
    this.login('default@gmail.com', 'password')
  }
}
</script>

<style scoped>
</style>
