<template>
  <div id="upload">
    upload
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
      link: '',
      solution: '',
      description: '',
      points: 1,
      expireDuration: 30,
      createdTime: Date.now()
    }
  },

  methods: {
    upload: function () {
      // let question = {
      //   link: file[key].link,
      //   solution: file[key].solution,
      //   description: file[key].description,
      //   points: file[key].points,
      //   expireDuration: file[key].expireMinutes * 60 * 1000,
      //   createdTime: Date.now(),
      //   responses: {},
      //   numRevealed: 0,
      //   totalGuessTime: 0,
      //   id: uuidv4(),
      //   op: 'alanolen',
      //   timeToCorrectRespTotal: 0
      // }
      questionsRef.push().update({})
    }
  },

  mounted () {
  }
}
</script>

<style scoped>
</style>
