<template>
  <span class="question">
    <form id="form" v-on:submit.prevent="addResponse">
      <input type="text" v-model="newResponse.user" placeholder="Username">
      <input type="text" v-model="newResponse.response" placeholder="Your guess">
      <input type="submit" value="Add Guess">
    </form>
  </span>
</template>

<script>
export default {
  props: {
    imageLink: String,
    answer: String,
    points: Number,
    winner: String,
    solved: Boolean
  },
  name: 'question',
  data () {
    return {
      newResponse: {
        user: '',
        response: ''
      }
    }
  },

  methods: {
    addResponse: function () {
      // greetingsRef.push(this.newGreeting)
      // this.newGreeting.lang = ''
      // this.newGreeting.text = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#form {
    width: 33.33%;
    width: calc(100% / 3);
    display: inline-block;
}
</style>
