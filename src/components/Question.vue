<template>
  <span class="question">
    <v-card v-if="isExpired" :class="qCardClass">
      <v-card-title primary-title class="">
        <div style="position: absolute; top: 5px; right: 7px; width: 100px; text-align:right;">
          Uploaded by {{ellipsizeText(op, 10)}}
        </div>
        <div>
          <h3 v-if="points === 1" class="headline mb-0">{{points}} point</h3>
          <h3 v-else class="headline mb-0">{{points}} points</h3>
          <span v-if="myQuestion">
            Duration: {{duration}}
          </span>
          <span v-else>
            Question closed {{timeAgo}}.
          </span>
        </div>
      </v-card-title>
      <a :href="link"><img class="qImage" :src="link" target="_blank"></a>
      <v-card-text>
        <b>{{description}}</b>
        <br>Solution: {{solution}}
        <br>
        <br>
        <question-details
          :responses="responses"
          :username="username"
          :id="id"
          :total-guess-time="totalGuessTime"
          :user-response-data="userResponseData"
          :num-revealed="numRevealed"
          :viewed-users="viewedUsers"
          :showMore="true"
          :time-to-correct-resp-total="timeToCorrectRespTotal">
        </question-details>
      </v-card-text>
    </v-card>

    <v-card v-else :class="qCardClass">
      <v-card-title primary-title class="">
        <div style="position: absolute; top: 5px; right: 7px; width: 100px; text-align:right;">
          Uploaded by {{ellipsizeText(op, 10)}}
        </div>
        <div>
          <span v-if="userResponseData.revealTime">
            <h3 v-if="points === 1" class="headline mb-0">{{points}} point</h3>
            <h3 v-else class="headline mb-0">{{points}} points</h3>
            Question closing in {{timeLeft}}.
          </span>
          <span v-else>
            <h3 class="headline mb-0">New {{points}} point question!</h3>
            Uploaded {{createdTimeAgo}}
          </span>
        </div>
      </v-card-title>
      <span v-if="userResponseData.revealTime">
        <a :href="link"><img class="qImage" :src="link" target="_blank"></a>
        <v-card-text>
          <h6 class="">{{description}}</h6>

          <question-details
            :responses="responses"
            :username="username"
            :id="id"
            :total-guess-time="totalGuessTime"
            :user-response-data="userResponseData"
            :num-revealed="numRevealed"
            :showMore="gotCorrectAlready"
            :viewed-users="viewedUsers"
            :time-to-correct-resp-total="timeToCorrectRespTotal">
          </question-details>

        </v-card-text>

        <v-card-actions v-if="!gotCorrectAlready">
          <v-flex xs9 pt-3>
            <div type="" @keyup.enter="submitGuess(newResponse)">
              <v-text-field
                class="mt-0 mb-0"
                name="guess"
                label="Your guess here"
                v-model="newResponse">
              </v-text-field>
            </div>
          </v-flex>
          <v-flex xs3>
            <v-btn
              v-on:click.native="submitGuess(newResponse)"
              flat right block class="blue--text">
              Submit
            </v-btn>
          </v-flex>
        </v-card-actions>
        <v-card-actions v-else>
          <h6>Correct.</h6>
        </v-card-actions>
      </span>
      <span v-else>
        <v-btn
          v-on:click.native="revealQuestion()"
          flat block class="orange--text ml-0">
          Click here to view
        </v-btn>
      </span>
    </v-card>

    <v-alert error dismissible v-model="usernamealert">
      Username cannot be blank!
    </v-alert>
    <v-alert error dismissible v-model="responsealert">
      Response cannot be blank!
    </v-alert>
  </span>
</template>

<script>
import moment from 'moment'
import Firebase from 'firebase'
import ellipsize from 'ellipsize'
import QuestionDetails from './QuestionDetails'

// Accessing the data reference
const app = Firebase.app()
const db = app.database()

export default {
  components: {
    QuestionDetails
  },

  props: {
    link: String,
    solution: String,
    description: String,
    points: Number,
    expireTime: Number,
    isExpired: Boolean,
    createdTime: Number,
    numRevealed: Number,
    expireDuration: Number,
    myQuestion: Boolean,
    responses: {
      type: Object,
      default: () => { return {} }
    },
    username: {
      type: String,
      default: ''
    },
    viewedUsers: {
      type: Object,
      default: () => { return {} }
    },
    id: String,
    op: String,
    totalGuessTime: Number,
    timeToCorrectRespTotal: Number,
    userResponseData: {
      type: Object,
      default: () => { return {} }
    }
  },

  computed: {
    timeAgo: function () {
      return moment(this.expireTime).fromNow()
    },
    createdTimeAgo: function () {
      return moment(this.createdTime).fromNow()
    },
    timeLeft: function () {
      if (this.expireTime - this.now > 60000) {
        return `${Math.floor(moment.duration(this.expireTime - this.now).asMinutes())} minutes`
      }
      return `${Math.floor(moment.duration(this.expireTime - this.now).asSeconds())} secs`
    },
    duration: function () {
      return `${Math.floor(moment.duration(this.expireDuration).asMinutes())} minutes`
    },
    questionRef: function () {
      return db.ref(`questions/${this.id}`)
    },
    responseRef: function () {
      return db.ref(`questions/${this.id}/responses`)
    },
    userRef: function () {
      return db.ref(`users/${this.username}`)
    },
    gotCorrectAlready: function () {
      return this.userResponseData.status === 'correct'
    },
    qCardClass: function () {
      if (!this.userResponseData.revealTime) {
        return 'qCard elevation-15'
      }
      if (!this.isExpired) {
        if (this.gotCorrectAlready) {
          return 'qCard elevation-15 light-green lighten-4'
        } else {
          return 'qCard elevation-15 amber lighten-4'
        }
      } else {
        if (this.gotCorrectAlready) {
          return 'qCard elevation-15 light-green lighten-4'
        } else {
          return 'qCard elevation-15 deep-orange lighten-4'
        }
      }
    }
  },

  data () {
    return {
      newResponse: '',
      usernamealert: false,
      responsealert: false,
      now: Date.now()
    }
  },

  mounted () {
    window.setInterval(() => {
      this.now = Date.now()
    }, 1000)
  },

  methods: {
    ellipsizeText: function (text, len) {
      return ellipsize(text, len)
    },
    revealQuestion: function () {
      let DATENOW = Date.now()
      if (this.username === '') {
        // Username Cannot be empty
        this.usernamealert = true
        return
      }
      this.userRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          // User exists, so we update.
          let updateResponse = {}
          updateResponse[this.id] = {
            'revealTime': DATENOW,
            'status': 'pending',
            'numGuesses': 0
          }
          this.userRef.child('responses').update(updateResponse)
          this.userRef.update({
            'lastUpdateTime': DATENOW
          })
        } else {
          // User doesn't exist. Crazy way to create dyanmic keys.
          let newuser = {}
          newuser[this.username] = {
            'score': 0,
            'createdTime': DATENOW,
            'lastUpdateTime': DATENOW,
            'numGuesses': 0,
            'numCorrect': 0,
            'totalGuessTime': 0,
            'responses': {}
          }
          newuser[this.username].responses[this.id] = {
            'revealTime': DATENOW,
            'status': 'pending',
            'numGuesses': 0
          }
          db.ref('users').update(newuser)
        }
      })

      this.questionRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          this.questionRef.update({
            'numRevealed': snapshot.val().numRevealed + 1
          })
          let vu = {}
          vu[this.username] = true
          this.questionRef.child('viewedUsers').update(vu)
        }
      })
    },
    submitGuess: function (newRes) {
      let DATENOW = Date.now()
      if (this.username === '') {
        // Username Cannot be empty
        this.usernamealert = true
        return
      }
      if (newRes.trim().length === 0) {
        // Responses cannot be empty
        this.responsealert = true
        return
      }
      this.userRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          // We assume user exists, so we update.
          this.userRef.child(`responses/${this.id}`).update({
            'numGuesses': snapshot.val().responses[this.id].numGuesses + 1,
            'mostRecentGuessTime': DATENOW
          })
          this.userRef.update({
            'numGuesses': snapshot.val().numGuesses + 1,
            'lastUpdateTime': DATENOW,
            'totalGuessTime': snapshot.val().totalGuessTime + (DATENOW - snapshot.val().responses[this.id].revealTime)
          })
        }
      })
      this.questionRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          this.questionRef.update({
            'totalGuessTime': snapshot.val().totalGuessTime + (DATENOW - this.userResponseData.revealTime)
          })
        }
      })

      let temp = {
        'username': this.username,
        'response': newRes,
        'timestamp': DATENOW,
        'status': 'pending',
        questionId: this.id
      }
      this.responseRef.push(temp)
      this.newResponse = ''
    }
  }
}
</script>

<style scoped>
  .qImage {
    max-width: 100%;
    max-height: 300px;
    display: block;
    margin: auto;
  }

  .qCard{
  }
</style>
