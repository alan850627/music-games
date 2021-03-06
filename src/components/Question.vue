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
            <question-details-min
              :responses="responses"
              :num-revealed="numRevealed"
              :viewed-users="viewedUsers">
            </question-details-min>
          </span>
          <span v-else>
            <span v-if="expireTime < now">Question closed {{timeAgo}}.</span>
            <span v-else>{{timeLeft}} left in the timer.</span>
            <question-details-min
              :responses="responses"
              :num-revealed="numRevealed"
              :viewed-users="viewedUsers">
            </question-details-min>
          </span>
        </div>
      </v-card-title>
      <audio v-if="isAudio" :src="link" controls class="audio">
        Your browser does not support the audio element.
      </audio>
      <a :href="link" target="_blank" v-else><img class="qImage" :src="link" target="_blank"></a>
      <v-card-text>
        <b>{{description}}</b>
        <br>Solution: {{solution}}
        <div v-html="additionalInfoWLinks" v-if="additionalInfo.length"></div>
        <br>
        <br>
        <question-details
          :responses="responses"
          :username="username"
          :id="id"
          :total-guess-time="totalGuessTime"
          :user-response-data="userResponseData"
          :num-revealed="numRevealed"
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
            <question-details-min
              :responses="responses"
              :num-revealed="numRevealed"
              :viewed-users="viewedUsers">
            </question-details-min>
          </span>
          <span v-else>
            <h3 class="headline mb-0">New {{points}} point question!</h3>
            Uploaded {{createdTimeAgo}}
            <question-details-min
              :responses="responses"
              :num-revealed="numRevealed"
              :viewed-users="viewedUsers">
            </question-details-min>
          </span>
        </div>
      </v-card-title>
      <span v-if="userResponseData.revealTime">
        <audio v-if="isAudio" :src="link" controls class="audio">
          Your browser does not support the audio element.
        </audio>
        <a :href="link" target="_blank" v-else><img class="qImage" :src="link" target="_blank"></a>
        <v-card-text>
          <h6 class="mb-1">{{description}}</h6>
          <div v-if="manualRevealAnswer || gotCorrectAlready">
            <b>Solution: {{solution}}</b>
            <div v-html="additionalInfoWLinks" v-if="additionalInfo.length"></div>
          </div>

          <question-details
            :responses="responses"
            :username="username"
            :id="id"
            :total-guess-time="totalGuessTime"
            :user-response-data="userResponseData"
            :num-revealed="numRevealed"
            :showMore="gotCorrectAlready || manualRevealAnswer"
            :time-to-correct-resp-total="timeToCorrectRespTotal">
          </question-details>

        </v-card-text>

        <v-card-actions v-if="!gotCorrectAlready && !manualRevealAnswer">
          <v-flex xs8>
            <div type="" @keyup.enter="submitGuess(newResponse)">
              <v-text-field
                class="mt-0 mb-0"
                name="guess"
                label="Your guess here"
                v-model="newResponse">
              </v-text-field>
            </div>
          </v-flex>
          <v-flex class="text-xs-right">
            <v-btn
              v-on:click.native="submitGuess(newResponse)"
              flat class="ma-0 blue--text action-button">
              Submit
            </v-btn>
            <v-btn
              v-on:click.native.stop="confirmReveal = true"
              flat small class="ma-0 red--text action-button">
              I GIVE UP
            </v-btn>
          </v-flex>
        </v-card-actions>
        <v-card-actions v-else class="pa-2">
          <h6 v-if="!manualRevealAnswer">Correct.</h6>
          <v-btn
            v-on:click.native="dismissQuestion()"
            icon class="action-button"
            title="Manually close this question">
            <v-icon class="icon">cancel</v-icon>
          </v-btn>
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
    <v-dialog v-model="confirmReveal">
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-text>Are you sure you want to give up?
          <br>The answer will be revealed to you.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="green--text darken-1" flat="flat" @click.native="confirmReveal = false">No</v-btn>
          <v-btn class="green--text darken-1" flat="flat" @click.native="confirmReveal = false; revealAnswer()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import QuestionDetailsMin from './QuestionDetailsMin'
import linkifyHtml from 'linkifyjs/html'
import sanitizeHtml from 'sanitize-html'

// Accessing the data reference
const app = Firebase.app()
const db = app.database()

export default {
  components: {
    QuestionDetails,
    QuestionDetailsMin
  },

  props: {
    link: String,
    solution: String,
    additionalInfo: {
      type: String,
      default: ''
    },
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
    isAudio: {
      type: Boolean,
      default: false
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
    additionalInfoWLinks: function () {
      return linkifyHtml(sanitizeHtml(this.additionalInfo, {
        allowedTags: [ 'b', 'i', 'em', 'strong' ]
      }), {
        defaultProtocol: 'https'
      })
    },
    manualRevealAnswer: function () {
      if (this.userResponseData.manualRevealAnswer) {
        return true
      }
      return false
    },
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
      now: Date.now(),
      confirmReveal: false
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
    dismissQuestion: function () {
      this.userRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          // We assume user exists, so we update.
          this.userRef.child(`responses/${this.id}`).update({
            'manualDismiss': true
          })
          this.userRef.update({
            'lastUpdateTime': Date.now()
          })
        }
      })
    },
    revealAnswer: function () {
      this.userRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          // We assume user exists, so we update.
          this.userRef.child(`responses/${this.id}`).update({
            'manualRevealAnswer': true
          })
          this.userRef.update({
            'lastUpdateTime': Date.now()
          })
        }
      })
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

  .action-button {
    margin-left:auto;
    margin-right:0;
  }

  .audio {
    width: 100%;
    margin: auto;
  }
</style>
