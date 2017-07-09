<template>
  <span class="question">
    <v-layout>
      <v-flex xs12 sm6 md4>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 v-if="isExpired" class="headline mb-0">{{Solution}}</h3>
              <h3 v-else class="headline mb-0">{{expireTime}}</h3>
            </div>
          </v-card-title>
          <img :src="link" height="100%" width="100%"/>
          <v-card-actions>
            <v-btn flat class="orange--text">Share</v-btn>
            <v-btn flat class="orange--text">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </span>
</template>

<script>
import countdown from 'countdown'
export default {
  props: {
    link: String,
    solution: String,
    description: String,
    points: Number,
    expireTime: Number,
    isExpired: Boolean,
    reponses: {
      type: Object,
      default: () => {
        return {}
      }
    },
    username: String
  },

  computed: {
    timeLeft: () => {
      return countdown(this.expireTime).toString()
    }
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
