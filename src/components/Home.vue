<template>
  <div>
    <v-layout pa-3>
      <v-flex xs12 sm8 offset-sm2>
        <v-card class="elevation-15">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Read before play:</h3>
              <div>
                * This site is very much in beta still, so any feedback welcome.
                <br>* Please enter your username by clicking the Login button. Everything should be pretty self explanatory.
                <br>* I did not thorougly test autograder, so if anything seems fishy, message me.
                <br>* Autograder is only active when my computer is on, so don't freakout if your response is stuck in "pending".
                <br>* You get infinite number of guesses, but every guess will be logged.
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

    <div>
      <v-layout mr-3 ml-3 mt-3 row-md column child-flex-sm wrap>
        <v-flex xs12 sm8 md4 pa-2 v-for="q in openQuestions">
          <question
            :link="q.link"
            :solution="q.solution"
            :description="q.description"
            :points="q.points"
            :expireTime="q.expireTime"
            :isExpired="false"
            :responses="q.responses"
            :id="q['.key']"
            :username="username">
          </question>
        </v-flex>
      </v-layout>

    </div>
    <div>
      <v-layout mr-5 ml-5 mt-3 row-md column child-flex-sm wrap>
        <v-flex xs12 sm8 md4 pa-2 v-for="q in closedQuestions">
          <question
            :link="q.link"
            :solution="q.solution"
            :description="q.description"
            :points="q.points"
            :expireTime="q.expireTime"
            :isExpired="true"
            :responses="q.responses"
            :id="q['.key']"
            :username="username">
          </question>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Question from './Question'
import Firebase from 'firebase'
// Initialize Firebase

const app = Firebase.app()
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
    questions: {
      source: questionsRef.orderByChild('expireTime'),
      default: []
    }
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
    this.$bindAsArray('questions', questionsRef.orderByChild('expireTime'))
  }
}
</script>

<style scoped>
</style>
