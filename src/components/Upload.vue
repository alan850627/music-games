<template>
  <div id="upload">
    <v-alert success dismissible v-model="successalert">
      Upload success!
    </v-alert>
    <v-alert error dismissible v-model="usernamealert">
      Username cannot be blank!
    </v-alert>
    <v-alert error dismissible v-model="linkalert">
      Invalid link! Make sure the link is a direct link to an image!
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
          hint="Hints, info, description. (eg. Identify the composer given this excerpt.)"
          persistent-hint
        ></v-text-field>
        <v-text-field
          label="Points"
          class="mt-5"
          v-model="points"
          hint="How many points is this question worth? (eg. 1)"
          suffix="point(s)"
          required
          :rules="[rules.isInteger]"
          persistent-hint
        ></v-text-field>
        <v-text-field
          label="Expire Time in minutes"
          class="mt-5"
          v-model="expireDuration"
          hint="How many minutes will the question last after a user opens it? (eg. 60)"
          suffix="minute(s)"
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
import mime from 'mime'

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
    userRef: function () {
      return db.ref(`users/${this.username}`)
    }
  },

  data () {
    return {
      successalert: false,
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
      return mime.lookup(url).match(/image/) !== null
    },
    upload: function () {
      if (this.username === '') {
        // Username Cannot be empty
        this.usernamealert = true
        this.successalert = false
        return
      } else {
        this.usernamealert = false
      }
      if (this.link.trim() === '' || !this.checkURL(this.link)) {
        // link
        this.linkalert = true
        this.successalert = false
        return
      } else {
        this.linkalert = false
      }
      if (this.solution.trim() === '') {
        // solution
        this.solutionalert = true
        this.successalert = false
        return
      } else {
        this.solutionalert = false
      }
      let pt = parseInt(this.points)
      if (!Number.isInteger(pt)) {
        // points
        this.pointsalert = true
        this.successalert = false
        return
      } else {
        this.pointsalert = false
      }
      let ti = parseInt(this.expireDuration)
      if (!Number.isInteger(ti)) {
        // expire time
        this.expiretimealert = true
        this.successalert = false
        return
      } else {
        this.expiretimealert = false
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
      this.userRef.update({
        'lastUpdateTime': Date.now()
      })
      this.toDefault()
      this.successalert = true
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
