<template>
  <div id="leaderboard">
    Leaderboard
  </div>
</template>

<script>
import Firebase from 'firebase'

// Accessing the data reference
const app = Firebase.app()
const db = app.database()
const usersRef = db.ref('users')

export default {
  name: 'leaderboard',

  components: {
  },

  firebase: {
    users: usersRef.orderByKey()
  },

  data () {
    return {
    }
  },

  methods: {
  },

  mounted () {
  }
}
</script>

<style scoped>
</style>
