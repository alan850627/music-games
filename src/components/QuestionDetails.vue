<template>
  <span class="questionDetails">
    <v-btn v-if="!moreDetails"
      v-on:click.native="setMoreDetails(true)"
      flat block class="black--text ml-0">
      Details
    </v-btn>
    <v-btn v-if="moreDetails"
      v-on:click.native="setMoreDetails(false)"
      flat block class="black--text ml-0">
      view less
    </v-btn>
    <div v-if="moreDetails">
      Avg Response Time (all guesses): {{getReadableDuration(totalGuessTime/numResponses)}}
      <br>Avg Response Time (correct guesses only): {{getReadableDuration(timeToCorrectRespTotal/correctResponses.length)}}
    </div>
    <v-layout v-if="moreDetails" row fluid>
      <v-flex xs-4>
        <v-card class="elevation-0">
          <v-card-text>
            <b>Correct:</b>
            <div v-if="correctResponses.length === 0">
              <div>none</div>
            </div>
            <div v-for="r in correctResponses">
              <div v-if="showMore" :title="r.response">{{ellipsizeText(r.username, 10)}}</div>
              <div v-if="!showMore">{{ellipsizeText(r.username, 10)}}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs-4>
        <v-card class="elevation-0">
          <v-card-text>
            <b>Incorrect:</b>
            <div v-if="incorrectResponses.length === 0">
              <div>none</div>
            </div>
            <div v-for="r in incorrectResponses">
              <div v-if="showMore || r.username === username" :title="r.response">{{ellipsizeText(r.username, 10)}}</div>
              <div v-if="!showMore && r.username !== username">{{ellipsizeText(r.username, 10)}}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs-4>
        <v-card class="elevation-0">
          <v-card-text>
            <b>Pending:</b>
            <div v-if="pendingResponses.length === 0">
              <div>none</div>
            </div>
            <div v-for="r in pendingResponses">
              <div v-if="showMore || r.username === username" :title="r.response">{{ellipsizeText(r.username, 10)}}</div>
              <div v-if="!showMore && r.username !== username">{{ellipsizeText(r.username, 10)}}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </span>
</template>

<script>
import moment from 'moment'
// import Firebase from 'firebase'
import ellipsize from 'ellipsize'
import _ from 'lodash'

export default {
  props: {
    responses: {
      type: Object,
      default: () => { return {} }
    },
    username: {
      type: String,
      default: ''
    },
    numRevealed: Number,
    id: String,
    totalGuessTime: Number,
    timeToCorrectRespTotal: Number,
    showMore: Boolean,
    userResponseData: {
      type: Object,
      default: () => { return {} }
    }
  },

  computed: {
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
    numResponses: function () {
      return Object.keys(this.responses).length
    }
  },

  methods: {
    ellipsizeText: function (text, len) {
      return ellipsize(text, len)
    },
    setMoreDetails: function (b) {
      this.moreDetails = b
    },
    getReadableDuration: function (t) {
      if (t === 0 || isNaN(t)) {
        return 'no data'
      }
      if (t > 60000) {
        return `${moment.duration(t).asMinutes().toFixed(1)} mins`
      }
      return `${(moment.duration(t).asSeconds()).toFixed(0)} secs`
    }
  },

  data () {
    return {
      moreDetails: false
    }
  }
}
</script>

<style scoped>
</style>
