<template>
  <div>
    <v-layout pl-3 pr-3 pb-3 pt-2>
      <v-flex xs12 sm10 offset-sm1>
        <v-card class="elevation-5">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Please read before playing:</h3>
              <div>
                * <a href="https://discord.gg/Mmy8Ch5">Live chat</a>.
                <br>* Please enter your username by clicking the "login" button to participate in music games.
                <br>* Once you reveal a question, you will have a certain amount of time to answer before it expires and the solution is shown to you.
                <br>* The autograder is only active when my computer is on, so don't worry if your response is stuck in "pending".
                <br>* You get infinite number of guesses with no penalty, but every guess will be logged.
                <br>* Upload your own questions <a href="/#/Upload">here</a>.
                <br>
                <br>Tip: You can view individual responses by hovering your mouse over the usernames.
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

    <v-expansion-panel v-if="openQuestions.length > 0" class="">
      <v-expansion-panel-content v-model="oqOpen" class="">
        <div slot="header" class="">
          <h4 class="mt-3">Open Questions</h4>
        </div>
        <div class="text-xs-center">
          <v-pagination :length="Math.ceil(openQuestions.length / chunk_size)" v-model="openQuestionsPageNum"></v-pagination>
        </div>
        <v-layout mr-3 ml-3 mt-3 row wrap class="pb-5">
          <v-flex xs12 sm8 md4 pa-2 v-if="oqOpen" v-for="q in openQuestionsChunk">
            <question
              :link="q.link"
              :solution="q.solution"
              :description="q.description"
              :points="q.points"
              :expire-time="getExpireTime(q)"
              :created-time="q.createdTime"
              :expire-duration="q.expireDuration"
              :my-question="false"
              :is-audio="q.isAudio"
              :is-expired="false"
              :responses="q.responses"
              :viewed-users="q.viewedUsers"
              :id="q['.key']"
              :username="username"
              :op="q.op"
              :total-guess-time="q.totalGuessTime"
              :time-to-correct-resp-total="q.timeToCorrectRespTotal"
              :num-revealed="q.numRevealed"
              :user-response-data="userResponseData[q['.key']]">
            </question>
          </v-flex>
        </v-layout>
        <div class="text-xs-center">
          <v-pagination :length="Math.ceil(openQuestions.length / chunk_size)" v-model="openQuestionsPageNum"></v-pagination>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel v-if="opQuestions.length > 0" class="">
      <v-expansion-panel-content v-model="mqOpen"class="">
        <div slot="header" class="">
          <h4 class="mt-3">My Questions</h4>
        </div>
        <div class="text-xs-center">
          <v-pagination :length="Math.ceil(opQuestions.length / chunk_size)" v-model="opQuestionsPageNum"></v-pagination>
        </div>
        <v-layout mr-3 ml-3 mt-3 row wrap class="pb-5">
          <v-flex xs12 sm8 md4 pa-2 v-if="mqOpen" v-for="q in opQuestionsChunk">
            <question
              :link="q.link"
              :solution="q.solution"
              :description="q.description"
              :points="q.points"
              :expire-time="getExpireTime(q)"
              :expire-duration="q.expireDuration"
              :my-question="true"
              :created-time="q.createdTime"
              :is-expired="true"
              :is-audio="q.isAudio"
              :responses="q.responses"
              :id="q['.key']"
              :username="username"
              :viewed-users="q.viewedUsers"
              :op="q.op"
              :total-guess-time="q.totalGuessTime"
              :time-to-correct-resp-total="q.timeToCorrectRespTotal"
              :num-revealed="q.numRevealed"
              :user-response-data="userResponseData[q['.key']]">
            </question>
          </v-flex>
        </v-layout>
        <div class="text-xs-center">
          <v-pagination :length="Math.ceil(opQuestions.length / chunk_size)" v-model="opQuestionsPageNum"></v-pagination>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel v-if="closedQuestions.length > 0" class="">
      <v-expansion-panel-content v-model="cqOpen"class="">
        <div slot="header" class="">
          <h4 class="mt-3">Closed Questions</h4>
        </div>
        <div class="text-xs-center">
          <v-pagination :length="Math.ceil(closedQuestions.length / chunk_size)" v-model="closedQuestionsPageNum"></v-pagination>
        </div>
        <v-layout mr-3 ml-3 mt-3 row wrap class="pb-5">
          <v-flex xs12 sm8 md4 pa-2 v-if="cqOpen" v-for="q in closedQuestionsChunk">
            <question
              :link="q.link"
              :solution="q.solution"
              :description="q.description"
              :points="q.points"
              :expire-time="getExpireTime(q)"
              :expire-duration="q.expireDuration"
              :my-question="false"
              :created-time="q.createdTime"
              :is-expired="true"
              :is-audio="q.isAudio"
              :responses="q.responses"
              :id="q['.key']"
              :username="username"
              :viewed-users="q.viewedUsers"
              :op="q.op"
              :total-guess-time="q.totalGuessTime"
              :time-to-correct-resp-total="q.timeToCorrectRespTotal"
              :num-revealed="q.numRevealed"
              :user-response-data="userResponseData[q['.key']]">
            </question>
          </v-flex>
        </v-layout>
        <div class="text-xs-center">
          <v-pagination :length="Math.ceil(closedQuestions.length / chunk_size)" v-model="closedQuestionsPageNum"></v-pagination>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import Question from './Question'
import Firebase from 'firebase'
import _ from 'lodash'
// Initialize Firebase

const app = Firebase.app()
const db = app.database()
const questionsRef = db.ref('questions')
const usersRef = db.ref('users')
const CHUNK_SIZE = 9

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
      source: questionsRef.orderByChild('createdTime'),
      default: []
    },
    users: {
      source: usersRef.orderByKey(),
      default: []
    }
  },

  computed: {
    openQuestions: function () {
      let presort = this.questions.filter((q) => {
        if (q.op === this.username) {
          return false
        }
        if (!this.userResponseData[q['.key']]) {
          return true
        }
        if (this.userResponseData[q['.key']].manualDismiss) {
          return false
        }
        return this.getExpireTime(q) >= this.now
      })
      return _.sortBy(presort, (o) => {
        return 0 - o.createdTime
      })
    },
    closedQuestions: function () {
      let presort = this.questions.filter((q) => {
        if (!this.userResponseData[q['.key']]) {
          return false
        }
        if (q.op === this.username) {
          return false
        }
        if (this.userResponseData[q['.key']].manualDismiss) {
          return true
        }
        return this.getExpireTime(q) < this.now
      })
      return _.sortBy(presort, (o) => {
        return 0 - this.getExpireTime(o)
      })
    },
    opQuestions: function () {
      let presort = this.questions.filter((q) => {
        return q.op === this.username
      })
      return _.sortBy(presort, (o) => {
        return 0 - o.createdTime
      })
    },
    openQuestionsChunk: function () {
      return _.chunk(this.openQuestions, CHUNK_SIZE)[this.openQuestionsPageNum - 1]
    },
    opQuestionsChunk: function () {
      return _.chunk(this.opQuestions, CHUNK_SIZE)[this.opQuestionsPageNum - 1]
    },
    closedQuestionsChunk: function () {
      return _.chunk(this.closedQuestions, CHUNK_SIZE)[this.closedQuestionsPageNum - 1]
    },
    userResponseData: function () {
      let usr = _.find(this.users, { '.key': this.username })
      if (!usr || !usr.responses) {
        return {}
      } else {
        return usr.responses
      }
    }
  },

  data () {
    return {
      now: Date.now(),
      oqOpen: false,
      mqOpen: false,
      cqOpen: false,
      closedQuestionsPageNum: 1,
      opQuestionsPageNum: 1,
      openQuestionsPageNum: 1,
      chunk_size: CHUNK_SIZE
    }
  },

  methods: {
    login: (email, password) => {
      Firebase.auth().signInWithEmailAndPassword(email, password).catch((err) => {
        console.err(err.message)
      })
    },
    getExpireTime: function (q) {
      return this.getRevealTime(q) + q.expireDuration
    },
    getRevealTime: function (q) {
      if (!this.userResponseData || !this.userResponseData[q['.key']]) {
        return Date.now()
      }
      return this.userResponseData[q['.key']].revealTime
    }
  },

  mounted () {
    this.login('default@gmail.com', 'password')
    this.$bindAsArray('questions', questionsRef.orderByChild('createdTime'))
    window.setInterval(() => {
      this.now = Date.now()
    }, 1000)
  }
}
</script>

<style scoped>
</style>
