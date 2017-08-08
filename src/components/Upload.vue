<template>
  <div id="upload">
    <v-alert error dismissible v-model="usernamealert">
      Username cannot be blank!
    </v-alert>
    <v-alert error dismissible v-model="linkalert">
      Invalid link! Make sure the link is a direct link to an image (aka link ending in .jpeg, .jpg, .gif, or .png)
    </v-alert>
    <v-alert error dismissible v-model="solutionalert">
      Invalid solution!
    </v-alert>
    <v-alert error dismissible v-model="pointsalert">
      Invalid points!
    </v-alert>
    <v-alert error dismissible v-model="expiretimealert">
      Invalid expire time!
    </v-alert>
    <v-layout row>
      <v-flex xs8 offset-xs2>
        <v-text-field
          label="Image link"
          class="mt-5"
          v-model="link"
          hint="Direct link to the question image. (eg. https://i.imgur.com/B52kpZE.png)"
          persistent-hint
          required
        ></v-text-field>
        <v-text-field
          label="Solution"
          class="mt-5"
          v-model="solution"
          hint="Solution to your question. (eg. Tchaikovsky - Symphony No. 6)"
          persistent-hint
          required
        ></v-text-field>
        <v-text-field
          label="Description"
          class="mt-5"
          v-model="description"
          hint="Hints, info, description. (eg. Identify the composer given this excerpt)"
          persistent-hint
        ></v-text-field>
        <v-text-field
          label="Points"
          class="mt-5"
          v-model="points"
          hint="How many points is this question worth? (eg. 1 point)"
          suffix="point(s)"
          required
          :rules="[rules.isInteger]"
          persistent-hint
        ></v-text-field>
        <v-text-field
          label="Expire Time"
          class="mt-5"
          v-model="expireDuration"
          hint="How long will the question last after a user sees the question? (eg. 60 minutes)"
          suffix="minutes"
          required
          :rules="[rules.isInteger]"
          persistent-hint
        ></v-text-field>
        <v-btn
          v-on:click.native="upload()"
          flat block class="orange--text ml-0 mt-5">
          Submit
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Firebase from 'firebase'

// Accessing the data reference
const app = Firebase.app()
const db = app.database()
const questionsRef = db.ref('questions')

export default {
  name: 'upload',

  props: {
    username: String
  },

  components: {
  },

  firebase: {
  },

  computed: {
  },

  data () {
    return {
      usernamealert: false,
      linkalert: false,
      solutionalert: false,
      pointsalert: false,
      expiretimealert: false,
      link: '',
      solution: '',
      description: '',
      points: 1,
      expireDuration: 60,
      rules: {
        isInteger: (value) => {
          if (!isNaN(value)) {
            return true
          } else {
            return 'Not a valid integer'
          }
        }
      }
    }
  },

  methods: {
    checkURL: function (url) {
      return (url.match(/\.(jpeg|jpg|gif|png)$/) != null)
    },
    upload: function () {
      if (this.username === '') {
        // Username Cannot be empty
        this.usernamealert = true
        return
      }
      if (this.link.trim() === '' || !this.checkURL(this.link)) {
        // link
        this.linkalert = true
        return
      }
      if (this.solution.trim() === '') {
        // solution
        this.solutionalert = true
        return
      }
      let pt = parseInt(this.points)
      if (!Number.isInteger(pt)) {
        // points
        this.pointsalert = true
        return
      }
      let ti = parseInt(this.expireDuration)
      if (!Number.isInteger(ti)) {
        // expire time
        this.expiretimealert = true
        return
      }
      let question = {
        link: this.link,
        solution: this.solution,
        description: this.description,
        points: pt,
        expireDuration: ti * 60 * 1000,
        createdTime: Date.now(),
        responses: {},
        numRevealed: 0,
        totalGuessTime: 0,
        op: this.username,
        timeToCorrectRespTotal: 0
      }
      questionsRef.push().update(question)
      this.toDefault()
    },
    toDefault: function () {
      this.link = ''
      this.solution = ''
      this.description = ''
      this.points = 1
      this.expireDuration = 60
    }
  },

  mounted () {
  }
}
</script>

<style scoped>
</style>
