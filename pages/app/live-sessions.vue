<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="4" lg="3" xl="2">
          <v-card class="mb-8">
            <v-row class="mx-0" align="center">
              <img class="ml-4 mr-3" src="/svg/sessions-camera.svg">
              <span class="lsess-title">Live Sessions Schedule</span>
            </v-row>

            <today-cards />
          </v-card>

          <v-btn
            class="text-none font-weight-bold"
            color="white"
            block
            solo
            x-large
          >
            Calendar
          </v-btn>
        </v-col>

        <v-col cols="12" md="8" lg="9" xl="10">
          <sessions-table />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'LiveSessions',

  computed: {
    ...mapState('live-sessions', ['sessions'])
  },

  created () {
    this.getLiveSessions()
  },

  methods: {
    ...mapActions('live-sessions', ['getLiveSessions'])
  }
}
</script>

<style lang="scss">
.lsess {
  &-title {
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.87;
  }
}
</style>
