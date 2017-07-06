<template>
  <div>
    <v-toolbar>
      <div class="headline hidden-xs-only">Alan's Music Games: </div>
      <v-spacer></v-spacer>
      <div class="subheading hidden-sm-and-down">Welcome {{username}}</div>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat v-on:click.native="route('/')">Home</v-btn>
        <v-btn flat v-on:click.native="route('Leaderboard')">Leaderboard</v-btn>
        <v-btn flat v-on:click.native="loginUser">Login</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      twoWay: true
    }
  },

  methods: {
    route (dest) {
      this.$router.push(dest)
    },
    loginUser () {
      console.log('login')
    }
  }
}
</script>

<style scoped>
</style>
