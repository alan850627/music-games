<template>
  <div id="leaderboard">
    <v-data-table
      v-bind:headers="headers"
      :items="users"
      hide-actions
      class="elevation-1"
    >
    <template slot="items" scope="props">
      <td>{{ props.item['.key'] }}</td>
      <td class="text-xs-right">{{ props.item.rank }}</td>
      <td class="text-xs-right">{{ props.item.score }}</td>
      <td class="text-xs-right">{{ props.item.numCorrect }}</td>
      <td class="text-xs-right">{{ props.item.numGuesses }}</td>
      <td class="text-xs-right">{{ getReadableDuration(props.item.avgResponseTime) }}</td>
      <td class="text-xs-right">{{ timeAgo(props.item.lastUpdateTime) }}</td>
    </template>
  </v-data-table>
  </div>
</template>

<script>
import Firebase from 'firebase'
import moment from 'moment'
import _ from 'lodash'

// Accessing the data reference
const app = Firebase.app()
const db = app.database()
const usersRef = db.ref('users')

export default {
  name: 'leaderboard',

  components: {
  },

  firebase: {
    usersRaw: usersRef.orderByChild('score')
  },

  computed: {
    users: function () {
      let users = _.cloneDeep(this.usersRaw)
      for (let i = 0; i < users.length; i++) {
        users[i]['rank'] = users.length - i
        if (isNaN(users[i].totalGuessTime / users[i].numGuesses)) {
          users[i]['avgResponseTime'] = Infinity
        } else {
          users[i]['avgResponseTime'] = users[i].totalGuessTime / users[i].numGuesses
        }
      }
      return users
    }
  },

  data () {
    return {
      headers: [
        {
          text: 'Users',
          align: 'left',
          sortable: false,
          value: '.key'
        },
        { text: 'Rank', value: 'rank' },
        { text: 'Score', value: 'score' },
        { text: 'Correct Guesses', value: 'numCorrect' },
        { text: 'Total Guesses', value: 'numGuesses' },
        { text: 'Avg Response Time', value: 'avgResponseTime' },
        { text: 'Last Active', value: 'lastUpdateTime' }
      ]
    }
  },

  methods: {
    timeAgo: function (time) {
      return moment(time).fromNow()
    },
    getReadableDuration: function (t) {
      if (t === 0 || isNaN(t) || t === Infinity) {
        return 'no data'
      }
      if (t > 60000) {
        return `${moment.duration(t).asMinutes().toFixed(1)} mins`
      }
      return `${(moment.duration(t).asSeconds()).toFixed(0)} secs`
    }
  },

  mounted () {
  }
}
</script>

<style scoped>
</style>
