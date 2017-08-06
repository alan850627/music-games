<template>
  <span class="question">
    <v-card v-if="isExpired" class="teal lighten-4">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Question closed {{timeLeft}}</h3>
        </div>
      </v-card-title>
      <img :src="link" height="100%" width="100%"/>
      <v-card-text>
        <h6 class="mb-0">{{description}}</h6>
        <br />Total Guesses:
        <br />Correct Guesses:
      </v-card-text>
      <v-card-actions>
      </v-card-actions>
    </v-card>

    <v-card v-else class="light-green lighten-4">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Question closing {{timeLeft}}</h3>
        </div>
      </v-card-title>
      <img :src="link" height="100%" width="100%"/>
      <v-card-text>
        <h6 class="mb-0">{{description}}</h6>
        <br />Total Guesses:
        <br />Correct Guesses:
      </v-card-text>
      <v-card-actions>
        <v-text-field
          name="guess"
          label="Your guess here"
          v-model="newResponse">
        </v-text-field>
        <v-btn v-on:click.native="submitGuess(newResponse)" light>Submit</v-btn>
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
    userResponses: function () {
      return _.filter(this.responses, (response) => {
        return response.username === this.username
      })
    },
    gotCorrectAlready: function () {
      for (let res in this.userResponses) {
        if (res.status === 'correct') {
          return true
        }
      }
      return false
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
          updateResponse[this.id] = false
          this.userRef.child('responses').update(updateResponse)
          this.userRef.update({
            'numGuesses': snapshot.val().numGuesses + 1
          })
        } else {
          // User doesn't exist. Crazy way to create dyanmic keys.
          let newuser = {}
          newuser[this.username] = {
            'score': 0,
            'createdTime': Date.now(),
            'numGuesses': 1,
            'numCorrect': 0,
            'responses': {}
          }
          newuser[this.username].responses[this.id] = false
          db.ref('users').set(newuser)
        }
      })

      let temp = {
        'username': this.username,
        'response': newRes,
        'timestamp': Date.now(),
        'status': 'pending'
      }
      this.responseRef.push(temp)
      this.newResponse = ''
    }
  }
}
</script>

<style scoped>
</style>
