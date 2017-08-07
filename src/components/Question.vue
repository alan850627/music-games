<template>
  <span class="question">
    <v-card v-if="isExpired" class="grey lighten-2 elevation-15">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{points}} point(s)</h3>
          Question closed {{timeLeft}}
        </div>
      </v-card-title>
      <img :src="link" height="100%" width="100%"/>
      <v-card-text>
        <h6 class="">{{description}}</h6>
        <h6>Solution: <strong>{{solution}}</strong></h6>
        <div v-if="Object.keys(responses).length === 0">
          <h6 class="">No Responses :(</h6>
        </div>
        <div v-else>
          <v-layout row fluid>
            <v-flex xs-4>
              <v-card class="elevation-0 grey lighten-2">
                <v-card-text>
                  <b>Correct:</b>
                  <span v-if="correctResponses.length === 0">
                    none
                  </span>
                  <div v-for="r in correctResponses">
                    {{ellipsizeText(r.username, 11)}}
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs-4>
              <v-card class="elevation-0 grey lighten-2">
                <v-card-text>
                  <b>Incorrect:</b>
                  <span v-if="incorrectResponses.length === 0">
                    none
                  </span>
                  <div v-for="r in incorrectResponses">
                    {{ellipsizeText(r.username, 11)}}
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs-4>
              <v-card class="elevation-0 grey lighten-2">
                <v-card-text>
                  <b>Pending:</b>
                  <span v-if="pendingResponses.length === 0">
                    none
                  </span>
                  <div v-for="r in pendingResponses">
                    {{ellipsizeText(r.username, 11)}}
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
      </v-card-text>
    </v-card>

    <v-card v-else class="elevation-15">
      <v-card-title primary-title>
        <div>
          <h3 class="headline pb-0 mb-0">{{points}} point(s)</h3>
          Question closing {{timeLeft}}
        </div>
      </v-card-title>
      <img :src="link" height="100%" width="100%"/>
      <v-card-text>
        <h6 class="">{{description}}</h6>

        <div v-if="Object.keys(responses).length === 0">
          <h6 class="">No Responses :(</h6>
        </div>
        <div v-else>
          <v-layout row fluid>
            <v-flex xs-4>
              <v-card class="elevation-0">
                <v-card-text>
                  <b>Correct:</b>
                  <span v-if="correctResponses.length === 0">
                    none
                  </span>
                  <div v-for="r in correctResponses">
                    {{ellipsizeText(r.username, 11)}}
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs-4>
              <v-card class="elevation-0">
                <v-card-text>
                  <b>Incorrect:</b>
                  <span v-if="incorrectResponses.length === 0">
                    none
                  </span>
                  <div v-for="r in incorrectResponses">
                    {{ellipsizeText(r.username, 11)}}
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs-4>
              <v-card class="elevation-0">
                <v-card-text>
                  <b>Pending:</b>
                  <span v-if="pendingResponses.length === 0">
                    none
                  </span>
                  <div v-for="r in pendingResponses">
                    {{ellipsizeText(r.username, 11)}}
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </div>

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
            flat right block class="orange--text">
            Submit
          </v-btn>
        </v-flex>
      </v-card-actions>
      <v-card-actions v-else>
        <h6>Correct!</h6>
      </v-card-actions>
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
import _ from 'lodash'

// Accessing the data reference
const app = Firebase.app()
const db = app.database()

export default {
  props: {
    link: String,
    solution: String,
    description: String,
    points: Number,
    expireTime: Number,
    isExpired: Boolean,
    responses: {
      type: Object,
      default: () => { return {} }
    },
    username: {
      type: String,
      default: ''
    },
    id: String
  },

  computed: {
    timeLeft: function () {
      return moment(this.expireTime).fromNow()
    },
    responseRef: function () {
      return db.ref(`questions/${this.id}/responses`)
    },
    userRef: function () {
      return db.ref(`users/${this.username}`)
    },
    correctResponses: function () {
      return _.filter(this.responses, (response) => {
        return response.status === 'correct'
      })
    },
    incorrectResponses: function () {
      return _.filter(this.responses, (response) => {
        return response.status === 'incorrect'
      })
    },
    pendingResponses: function () {
      return _.filter(this.responses, (response) => {
        return response.status === 'pending'
      })
    },
    gotCorrectAlready: function () {
      let arr = this.correctResponses.filter((res) => {
        return res.username === this.username
      })
      return arr.length
    }
  },

  data () {
    return {
      newResponse: '',
      usernamealert: false,
      responsealert: false
    }
  },

  mounted () {
  },

  methods: {
    ellipsizeText: function (text, len) {
      return ellipsize(text, len)
    },
    submitGuess: function (newRes) {
      // Response cannot be empty
      // Correct responses cannot be submitted again
      // Check for correctness
      // Change scores
      // Add user if necessary
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
          // User exists, so we update.
          let updateResponse = {}
          updateResponse[this.id] = true
          this.userRef.child('responses').update(updateResponse)
          this.userRef.update({
            'numGuesses': snapshot.val().numGuesses + 1,
            'lastUpdateTime': Date.now()
          })
        } else {
          // User doesn't exist. Crazy way to create dyanmic keys.
          let newuser = {}
          newuser[this.username] = {
            'score': 0,
            'createdTime': Date.now(),
            'lastUpdateTime': Date.now(),
            'numGuesses': 1,
            'numCorrect': 0,
            'responses': {}
          }
          newuser[this.username].responses[this.id] = true
          db.ref('users').update(newuser)
        }
      })

      let temp = {
        'username': this.username,
        'response': newRes,
        'timestamp': Date.now(),
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
</style>
