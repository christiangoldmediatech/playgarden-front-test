<template>
  <v-main>
    <v-container :class="{ 'lsess-container': !$vuetify.breakpoint.smAndDown }" fluid>
      <v-row class="fill-height">
        <v-col class="lsess-daily" cols="12" md="4" lg="3" xl="2">
          <div class="fill-height d-flex flex-column">
            <v-card class="mb-8  flex-shrink-0 flex-grow-1">
              <v-row class="mx-0" align="center">
                <img class="ml-4 mr-3" src="/svg/sessions-camera.svg">
                <span class="lsess-title">Live Sessions Schedule</span>
              </v-row>

              <today-cards />
            </v-card>

            <v-btn
              class="text-none font-weight-bold flex-shrink-1 flex-grow-0"
              color="white"
              block
              solo
              x-large
            >
              Calendar
            </v-btn>
          </div>
        </v-col>

        <v-col class="lsess-schedule" cols="12" md="8" lg="9" xl="10">
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

  // created () {
  //   this.getLiveSessions()
  // },

  methods: {
    ...mapActions('live-sessions', ['getLiveSessions'])
  }
}
</script>

<style lang="scss">
.lsess {
  &-container {
    height: calc(100vh - 64px);
    max-height: calc(100vh - 64px);
    overflow: hidden;
  }
  &-daily{
    height: 100%;
    max-height: 100%;
  }
  &-schedule {
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  &-title {
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.87;
  }
}
</style>
