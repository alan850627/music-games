<template>
  <span class="questionDetailsMin">
    <div :title="`Viewed by${getViewedUsers}`">Viewed by {{numRevealed}} users, ({{correctResponses.length}} correct responses)</div>
  </span>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    responses: {
      type: Object,
      default: () => { return {} }
    },
    numRevealed: Number,
    userResponseData: {
      type: Object,
      default: () => { return {} }
    },
    viewedUsers: {
      type: Object,
      default: () => { return {} }
    }
  },

  computed: {
    correctResponses: function () {
      return _.filter(this.responses, (response) => {
        return response.status === 'correct'
      })
    },
    getViewedUsers: function () {
      let i = 2
      return Object.keys(this.viewedUsers).sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase())
      }).map((o) => {
        if (i === 5) {
          i = 1
          return '\n' + o
        } else {
          i++
          return ' ' + o
        }
      })
    }
  },

  methods: {
  },

  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
