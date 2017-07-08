<template>
  <div id="app">
    <app-header :username="username"></app-header>
    <router-view></router-view>
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

    data () {
      return {
        username: ''
      }
    },

    methods: {
    },

    mounted () {
      console.log(cookies.get('musicusername'))
      this.uername = cookies.get('musicusername')
    }
  }
</script>

<style scoped>
</style>
