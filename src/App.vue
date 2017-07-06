<template>
  <div id="app">
    <app-header :username="username"></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import AppHeader from './components/AppHeader'
  import cookies from 'browser-cookies'

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
      this.uername = cookies.get('username')
    }
  }
</script>

<style scoped>
</style>
