<template>
  <v-overlay v-model="dialog" class="entry-overlay" :dark="false" light>
    <div class="entry-container">
      <v-card class="entry-card">
        <template v-if="entry">
          <div class="green-line-bigger green-line-1" />
          <div class="green-line-bigger green-line-2" />
          <div v-if="$vuetify.breakpoint.smAndDown" class="entry-card-elipse">
            <img class="entry-card-elipse-img" :src="entry.activityType.icon">
          </div>

          <v-container class="entry-card-content">
            <v-row>
              <div v-if="$vuetify.breakpoint.mdAndUp" class="entry-card-elipse">
                <img
                  class="entry-card-elipse-img"
                  :src="entry.activityType.icon"
                >
              </div>
              <v-col>
                <div class="entry-card-title">
                  {{ entry.title }}
                </div>
                <div class="entry-card-date">
                  {{ date }}
                </div>
                <div class="entry-card-teacher pb-10">
                  With {{ entry.teacher }}
                </div>

                <div class="entry-card-description pb-6">
                  <p class="entry-card-description-title">
                    Description
                  </p>
                  {{ entry.description }}
                </div>

                <div class="entry-card-description pb-6">
                  <p class="entry-card-description-title">
                    Recommended ages
                  </p>
                  {{ entry.ages }}
                </div>

                <div
                  v-if="entry.inCollaborationWith"
                  class="entry-card-description-title pb-6 d-flex align-start"
                >
                  By:
                  <img
                    class="entry-card-collaborator ml-6"
                    :src="entry.inCollaborationWith"
                  >
                </div>
              </v-col>
            </v-row>

            <div v-if="isRecorded" class="pb-3">
              <v-btn
                class="white--text text-none"
                color="accent"
                x-large
                block
                @click.stop="openVideo"
              >
                Watch recorded class
              </v-btn>
            </div>

            <div v-if="!past" class="pb-3">
              <v-btn
                class="white--text"
                color="accent"
                x-large
                :href="entry.link"
                :disabled="!isLive"
                target="_blank"
                block
              >
                OPEN ZOOM LINK
              </v-btn>
            </div>

            <pg-ics-calendar v-if="!past" :entry="entry" />

            <v-btn block text @click.stop="dialog = false">
              Close
            </v-btn>
          </v-container>
        </template>
      </v-card>
    </div>
  </v-overlay>
</template>

<script>
import { getNumberOrder, hours24ToHours12 } from '@/utils/dateTools'

export default {
  name: 'EntryDialog',

  data: () => {
    return {
      dialog: false,
      entry: null,
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    }
  },

  computed: {
    isLive () {
      const today = new Date()
      const start = new Date(this.entry.dateStart)
      const end = new Date(this.entry.dateEnd)

      return (
        today.getTime() >= (start.getTime() - (5 * 60 * 1000)) &&
        today.getTime() <= (end.getTime() + (5 * 60 * 1000))
      )
    },

    past () {
      const today = new Date()
      const end = new Date(this.entry.dateEnd)

      return today.getTime() >= end.getTime()
    },

    isRecorded () {
      return (
        this.entry.videos &&
        this.entry.videos.videoUrl &&
        this.entry.videos.videoUrl.HLS
      )
    },

    ages () {
      if (this.entry && !isNaN(this.entry.ages)) {
        return `2${this.entry.ages > 2 ? ' - ' + this.entry.ages : ''}`
      }
      return 'All ages'
    },

    date () {
      if (this.entry) {
        const date = new Date(this.entry.dateStart)
        const endDate = new Date(this.entry.dateEnd)
        const monthAndDay = `${this.months[date.getMonth()]} ${getNumberOrder(
          date.getDate()
        )}`
        const startTime = `${hours24ToHours12(
          date.getHours(),
          date.getMinutes()
        )}`
        const endTime = `${hours24ToHours12(
          endDate.getHours(),
          endDate.getMinutes()
        )}`
        return `${monthAndDay},  ${startTime} - ${endTime}`
      }
      return ''
    }
  },

  watch: {
    dialog (val) {
      if (val) {
        document.querySelector('html').style.overflowY = 'hidden'
      } else {
        document.querySelector('html').style.overflowY = 'auto'
      }
    }
  },

  created () {
    this.$nuxt.$on('open-entry-dialog', (entry) => {
      this.entry = entry
      this.dialog = true
    })
  },

  methods: {
    openVideo () {
      this.$nuxt.$emit('open-recorded-class-player', {
        playlist: [
          {
            title: this.entry.title,
            videoId: this.entry.id,
            src: [
              {
                src: this.entry.videos.videoUrl.HLS,
                type: 'application/x-mpegURL'
              }
            ]
          }
        ],
        index: 0
      })
    }
  }
}
</script>

<style lang="scss">
.entry {
  &-overlay .v-overlay__content {
    min-width: 100vw;
    padding: 12px;
  }
  &-container {
    max-width: 800px;
    max-height: 95vh;
    padding-top: 80px;
    overflow-y: hidden;
    margin: 0 auto;
    @media screen and (min-width: 960px) {
      padding-top: 0px;
    }
  }
  &-card {
    position: relative;
    overflow-y: visible;
    max-height: 100%;
    &-elipse {
      position: absolute;
      width: 156px;
      height: 156px;
      margin: 0 auto;
      top: calc(0px - 78px);
      left: calc(50% - 78px);
      background-color: white;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      border-radius: 50%;
      border: solid 10px #c2daa5;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 300;
      @media screen and (min-width: 960px) {
        width: 111px;
        height: 111px;
        position: static;
        top: auto;
        left: auto;
        z-index: auto;
        margin: 12px;
        border: solid 5px #c2daa5;
      }
    }
    &-content {
      max-height: calc(99vh - 200px);
      overflow-y: scroll;
      @media screen and (min-width: 960px) {
        max-height: calc(95vh - 60px);
        padding: 0 12%;
        padding-top: 32px;
        padding-bottom: 32px;
      }
    }
    &-title {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.5;
    }
    &-date {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.5;
    }
    &-teacher {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.5;
    }
    &-description {
      font-weight: 400;
      line-height: 1.5;
      &-title {
        font-weight: 700;
        line-height: 1.5;
      }
    }
    &-activity-type {
      font-size: 30px;
      font-weight: bold;
      line-height: 1.87;
    }
    &-collaborator {
      width: 100%;
      max-width: 142px;
    }
  }
}
</style>
