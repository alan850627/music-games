<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>Music Games</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat v-on:click.native="route('/')">Home</v-btn>
        <v-btn flat v-on:click.native="route('Leaderboard')">Leaderboard</v-btn>
        <v-btn flat v-on:click.native="loginUser">Login</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- <v-card md-theme="green">
      <md-card-header>
        <md-layout md-row>
          <img src="../assets/logo.png" />
          <md-layout md-column>
            <div class="md-display-1">Music Games</div>
            <div class="md-subheading">Alan's game for /r/classicalmusic</div>
            <p></p>
            <span class="md-title">Welcome {{username}}!</span>
            <div class=""
          </md-layout>
        </md-layout>
      </md-card-header>
    </v-card> -->
    <!-- <md-dialog-prompt
      md-title="Username"
      md-ok-text="OK"
      md-cancel-text="CANCEL"
      @open="onOpen"
      @close="onClose"
      v-model="username"
      ref="dialogUsername">
    </md-dialog-prompt> -->
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
