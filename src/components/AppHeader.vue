<template>
  <div>
    <v-toolbar>
      <div class="headline hidden-xs-only">Alan's Music Games</div>
      <v-spacer></v-spacer>
      <div class="subheading hidden-sm-and-down">Welcome {{username}}!</div>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat v-on:click.native="route('/')">Home</v-btn>
        <v-btn flat v-on:click.native="route('Leaderboard')">Leaderboard</v-btn>
        <v-btn flat v-on:click.native.stop="loginUser">Login</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-dialog v-model="loginDialog" persistent style="display:none;">
      <v-card>
        <v-card-title>
          <span class="headline">Username</span>
        </v-card-title>
        <v-card-text>
          <div type="" @keyup.enter="dialogSave">
          <slot name='input'></slot>
        </div>
          <small>
            *Enable cookies to save for next visit.
          </small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="blue--text darken-1"
            flat
            @click.native="dialogSave">DONE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import cookies from 'browser-cookies'

export default {
  props: {
    username: {
      type: String
    }
  },

  components: {
  },

  data () {
    return {
      loginDialog: false
    }
  },

  methods: {
    route (dest) {
      this.$router.push(dest)
    },
    loginUser () {
      this.loginDialog = true
    },
    dialogSave () {
      cookies.set('musicusername', this.username, {expires: 1825})
      this.loginDialog = false
    }
  }
}
</script>

<style scoped>
</style>
