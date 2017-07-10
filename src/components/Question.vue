<template>
  <span class="question">
    <v-layout>
      <v-flex xs12 sm6 md4>
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

      </v-flex>
    </v-layout>
  </span>
</template>

<script>
import moment from 'moment'
import * as search from 'youtube-search'

const opts = {
  maxResults: 10,
  key: 'AIzaSyADtiS-UxkTMe6kpI920BURFww51d2YZY8'
}

export default {
  props: {
    link: String,
    solution: String,
    description: String,
    points: Number,
    expireTime: Number,
    isExpired: Boolean,
    reponses: {
      type: Array,
      default: () => { return [] }
    },
    username: String
  },

  computed: {
    timeLeft: function () {
      return moment(this.expireTime).fromNow()
    }
  },

  data () {
    return {
      newResponse: '',
      correctResults: null
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
      if (!this.correctResults) {
        search(this.solution, opts, function (err, results) {
          if (err) {
            console.log(err)
          }

          console.log(results)
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
