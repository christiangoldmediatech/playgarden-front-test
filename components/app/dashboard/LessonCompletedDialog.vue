<template>
  <v-overlay
    class="lesson-completed"
    :value="value"
    :z-index="4000"
  >
    <v-card class="lesson-completed-container" light>
      <div class="pos-absolute pos-top-0 pos-left-0 w-100">
        <div class="green-line-bigger green-line-1" />
        <div class="green-line-bigger green-line-2" />
      </div>

      <div class="lesson-completed-content">
        <v-row class="lesson-completed-content-row">
          <div class="lesson-completed-player">
            <pg-inline-video-player use-standard-poster @ready="onPlayerReady" />
          </div>
          <div class="lesson-completed-options">
            <div class="lesson-completed-title">
              What do you want to do next?
            </div>
            <v-row class="mx-0">
              <div class="lesson-completed-button">
                <v-btn color="accent" block :small="$vuetify.breakpoint.mdAndDown" :large="$vuetify.breakpoint.lgAndUp" @click.stop="goToWorksheets">
                  <v-icon class="lesson-completed-icon">
                    pg-icon-paper-pencil
                  </v-icon>
                  COMPLETE WORKSHEETS
                </v-btn>
              </div>

              <div class="lesson-completed-button">
                <v-btn
                  color="#FEC572"
                  block
                  :small="$vuetify.breakpoint.mdAndDown"
                  :large="$vuetify.breakpoint.lgAndUp"
                  @click.stop="skipToActivities"
                >
                  <v-icon class="lesson-completed-icon">
                    pg-icon-play
                  </v-icon>
                  SKIP TO ACTIVITIES
                </v-btn>
              </div>

              <v-col class="pa-1" cols="12">
                <v-btn
                  class="dashboard-message-btn"
                  color="primary"
                  text
                  block
                  tile
                  :x-small="$vuetify.breakpoint.smAndDown"
                  :disabled="loading"
                  @click.stop="$emit('input', false)"
                >
                  Return to dashboard
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-row>
      </div>
    </v-card>
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex'
import DashboardLink from '@/mixins/DashboardLinkMixin.js'

import { APP_EVENTS } from '@/models'

export default {
  name: 'LessonCompletedDialog',

  mixins: [DashboardLink],

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  data: () => {
    return {
      loading: false,
      player: null
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' })
  },

  watch: {
    value (val) {
      if (val) {
        this.waitAndPlay()
      } else {
        this.$emit('close')
      }
    }
  },

  methods: {
    onPlayerReady (player) {
      player.loadPlaylist([{
        videoId: 1,
        title: '',
        src:
          {
            src: 'https://d3dnpqxalhovr4.cloudfront.net/out/v1/24b478a52d0f4d8ea11bdd0a2bb43c59/748ec5dbba9f4aa0a2eef8a74fb2c043/68b7491c440d41d4b8b6fb0ae08fe0b4/index.m3u8',
            type: 'application/x-mpegURL'
          }
      }], 0)
      this.player = player
    },

    goToWorksheets () {
      this.$appEventBus.$emit(APP_EVENTS.DASHBOARD_ONLINE_WORKSHEET_CLICKED)
      this.$router.push(this.generateNuxtRoute('online-worksheet'))
    },

    skipToActivities () {
      // Find first activity
      const activities = this.lesson.lessonsActivities.map(({ activity }) => activity)
      if (activities.length) {
        const validActivities = this.lesson.lessonsActivities.filter(({ activity }) => {
          return activity.videos.videoUrl
        })

        const playlist = validActivities.map(({ id, activity }) => {
          return {
            title: activity.videos.name,
            description: activity.videos.description,
            activityType: activity.activityType,
            curriculumType: activity.curriculumType,
            src: {
              src: activity.videos.videoUrl.HLS,
              type: 'application/x-mpegURL'
            },
            poster: activity.videos.thumbnail,
            lessonActivityId: id,
            activityId: activity.id,
            videoId: activity.videos.id,
            viewed: activity.viewed
          }
        })

        this.$nuxt.$emit('open-lesson-activity-player', { playlist, index: 0 })
        this.$router.push(this.generateNuxtRoute('lesson-activities', { id: activities[0].id }))
      }
    },

    waitAndPlay () {
      const wait = window.setInterval(() => {
        if (this.player) {
          this.player.currentTime(0)
          this.player.play()
          window.clearInterval(wait)
        }
      }, 100)
    }
  }
}
</script>

<style lang="scss">
.lesson-completed {
  & .green-line-1 {
    height: 12px
  }
  & .green-line-2 {
    height: 17px;
  }
  & .v-overlay__content {
    width: 100vw;
    height: 100vh;
    padding: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-container {
    width: 100%;
    max-height: 100%;
    max-width: 960px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 29px;
  }
  &-content {
    height: 100%;
    &-row {
      margin: 0;
      @media screen and (max-width: 1264px) and (orientation: landscape) {
        flex-wrap: nowrap;
      }
    }
  }
  &-player {
    overflow-x: hidden;
    width: 100%;
  }
  &-options {
    padding: 8px;
    width: 100%;
    @media screen and (max-width: 1264px) and (orientation: landscape) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      & > div {
        flex-basis: initial;
        flex-grow: 0;
      }
    }
  }
  &-title {
    font-weight: 600;
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
    @media screen and (min-width: 960px) {
      font-size: 24px;
    }
    @media screen and (min-width: 1264px) {
      font-size: 33px;
    }
  }
  &-button {
    width: 100%;
    padding: 4px;
    @media screen and (min-width: 600px) {
      width: 50%
    }
    @media screen and (max-width: 1263px) and (orientation: landscape) {
      width: 100%;
    }
    @media screen and (min-width: 1264px) {
      padding: 12px;
    }
  }
  &-icon {
    font-size: 18px !important;
    line-height: 1;
    position: relative;
    right: 16px;
    @media screen and (min-width: 1264px) {
      font-size: 24px !important;
    }
  }
}
</style>
