<template>
  <span class="question">
    <form id="form" v-on:submit.prevent="addResponse">
      <input type="text" v-model="newResponse.response" placeholder="Your guess">
      <input type="submit" value="Add Guess">
    </form>
  </span>
</template>

<script>
export default {
  props: {
    link: String,
    solution: String,
    category: String,
    points: Number,
    expireTime: Number,
    reponses: {
      type: Object,
      default: () => {
        return {}
      }
    },
    user: String
  },

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
    }
  }
}
</script>

<style scoped>
</style>
