<template>
  <div id="app">
    <app-header :username="username">
      <v-text-field
        slot="input"
        label="Who are you?*"
        hint="This name will show up everywhere"
        v-model="rawUsername">
      </v-text-field>
    </app-header>
    <router-view :username="username"></router-view>
  </div>
</template>

<script>
  import AppHeader from './components/AppHeader'
  import cookies from 'browser-cookies'
  import Firebase from 'firebase'

  // Initialize Firebase
  let config = {
    apiKey: 'AIzaSyDm4x3mKWK4tAnKQlrsE8MaQgjZeSWvOCQ',
    authDomain: 'music-games.firebaseapp.com',
    databaseURL: 'https://music-games.firebaseio.com',
    projectId: 'music-games',
    storageBucket: 'music-games.appspot.com',
    messagingSenderId: '792809265103'
  }

  // Here we are initializing the Firebase connection.
  Firebase.initializeApp(config)

  export default {
    name: 'app',

    components: {
      AppHeader
    },

    computed: {
      username: function () {
        if (!this.rawUsername) {
          return ''
        }
        return this.rawUsername.trim()
      }
    },

    data () {
      return {
        rawUsername: ''
      }
    },

    methods: {
    },

    mounted () {
      this.rawUsername = cookies.get('musicusername')
    }
  }
</script>

<style scoped>
</style>
