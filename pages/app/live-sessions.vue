<template>
  <v-main>
    <v-container :class="{ 'lsess-container': !$vuetify.breakpoint.smAndDown }" fluid>
      <v-row class="fill-height">
        <v-col class="lsess-daily" cols="12" md="4" lg="3" xl="2">
          <today-cards-panel v-if="mode === 'TODAY'" @mode-change="mode = 'CALENDAR'" />
          <calendar-panel v-else v-model="today" @mode-change="mode = 'TODAY'" />
        </v-col>

        <v-col class="lsess-schedule" cols="12" md="8" lg="9" xl="10">
          <sessions-table :today="today" />
        </v-col>
      </v-row>
    </v-container>
    <entry-dialog />
  </v-main>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'LiveSessions',

  data: () => {
    return {
      mode: 'TODAY',
      today: null
    }
  },

  computed: {
    ...mapState('live-sessions', ['sessions'])
  },

  watch: {
    today () {
      this.getUserLiveSessions(this.today)
    }
  },

  created () {
    this.getUserLiveSessions(this.today)
    const today = new Date()
    this.today = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate()).toString().padStart(2, '0')}`
  },

  methods: {
    ...mapActions('live-sessions', ['getUserLiveSessions'])
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
  }
  &-title {
    font-size: 1.15rem;
    font-weight: bold;
    line-height: 1.87;
  }
  &-calendar {
    &-btn {
      min-height: 64px;
    }
  }
}
</style>
