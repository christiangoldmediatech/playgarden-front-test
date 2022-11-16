<template>
  <v-overlay
    v-model="dialog"
    class="entry-overlay"
    :dark="false"
    light
    z-index="2000"
  >
    <div class="entry-container">
      <template v-if="entry">
        <v-card class="entry-card" :style="{'--borderColor': entry.type === 'LiveClass' ? '#F89838' : '#68C453'}">
          <div v-if="$vuetify.breakpoint.smAndDown" class="entry-card-elipse">
            <img class="entry-card-elipse-img" :src="entry.activityType.icon" />
          </div>

          <v-container class="entry-card-content">
            <v-row>
              <div v-if="$vuetify.breakpoint.mdAndUp" class="entry-card-elipse">
                <div v-if="entry.teacher" class="pg-relative">
                  <img
                    class="entry-card-elipse-img ml-1 mt-1 pg-object-cover"
                    :src="entry.teacher.img"
                  />
                  <img
                    class="pg-w-[50px] pg-h-[50px] pg-bg-white pg-rounded-full pg-p-1 pg-shadow-sm pg-absolute pg-bottom-0 pg-right-[-5px]"
                    :src="entry.activityType.icon"
                  />
                </div>
                <div v-else>
                  <img
                    class="lsess-table-entry-type ml-1 mt-1"
                    :src="entry.activityType.icon"
                  />
                </div>
              </div>
              <v-col>
                <div class="entry-card-title">
                  {{ entry.title }}
                </div>
                <div class="entry-card-date">
                  {{ date }}
                </div>
                <div v-if="entry.teacher" class="entry-card-teacher pb-10">
                  With {{ entry.teacher.name }}
                </div>
                <div v-else class="entry-card-teacher pb-10">
                  With {{ entry.teacher }}
                </div>

                <div class="entry-card-description pb-3">
                  <p class="entry-card-description-title" :style="{'--textColor': entry.type === 'LiveClass' ? '#F89838' : '#68C453'}">
                    Description
                  </p>
                  {{ entry.description }}
                </div>

                <div class="pb-6">
                  <v-btn
                    v-if="entry.file"
                    nuxt
                    large
                    color="primary"
                    class="text-transform-none"
                    :target="downloadTarget"
                    :href="entry.file"
                  >
                    <v-icon left>
                      mdi-download-outline
                    </v-icon>
                    <template v-if="isCooking">
                      Download Ingredient List
                    </template>
                    <template v-else>
                      Download Additional Information
                    </template>
                  </v-btn>
                </div>
                <div class="entry-card-description pb-6">
                  <p class="entry-card-description-title" :style="{'--textColor': entry.type === 'LiveClass' ? '#F89838' : '#68C453'}">
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
                  />
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
                @click="doSaveAttendance"
              >
                OPEN ZOOM LINK
              </v-btn>
            </div>

            <pg-ics-calendar v-if="!past" :entry="entry" />

            <v-btn block text @click.stop="dialog = false">
              Close
            </v-btn>
          </v-container>
        </v-card>
      </template>
    </div>
  </v-overlay>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { TAG_MANAGER_EVENTS } from '@/models'

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
    ...mapGetters('auth', ['getUserInfo']),

    isCooking() {
      let isCooking = false

      if (this.entry) {
        // check name
        if (this.entry.name) {
          const entryName = this.entry.name.toLowerCase()
          isCooking = entryName.includes('cooking')
        }

        // check activity type
        if (this.entry.activityType && this.entry.activityType.name) {
          const activityName = this.entry.activityType.name.toLowerCase()
          if (
            activityName.includes('cooking') ||
            activityName.includes('nutrition')
          ) {
            isCooking = true
          }
        }
      }

      return isCooking
    },

    downloadTarget() {
      if (this.isCooking) {
        return '_blank'
      }
      return this.entry.downloadNewTab ? '_blank' : '_self'
    },

    isLive() {
      const today = new Date()
      const start = new Date(this.entry.dateStart)
      const end = new Date(this.entry.dateEnd)

      return (
        today.getTime() >= start.getTime() - 30 * 60 * 1000 &&
        today.getTime() <= end.getTime() + 30 * 60 * 1000
      )
    },

    past() {
      const today = new Date()
      const end = new Date(this.entry.dateEnd)

      return today.getTime() >= end.getTime() + 30 * 60 * 1000
    },

    isRecorded() {
      return (
        this.entry.videos &&
        this.entry.videos.videoUrl &&
        this.entry.videos.videoUrl.HLS
      )
    },

    ages() {
      if (this.entry && !isNaN(this.entry.ages)) {
        return `2${this.entry.ages > 2 ? ' - ' + this.entry.ages : ''}`
      }
      return 'All ages'
    },

    date() {
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
    dialog(val) {
      if (val) {
        document.querySelector('html').style.overflowY = 'hidden'
      } else {
        document.querySelector('html').style.overflowY = 'auto'
      }
    }
  },

  created() {
    this.$nuxt.$on('open-entry-dialog', (entry) => {
      this.entry = entry
      this.dialog = true
    })
  },

  methods: {
    ...mapActions('live-sessions', ['saveAttendance']),

    doSaveAttendance() {
      this.saveAttendance(this.entry.id)
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.LIVE_CLASSES_ITEM_ZOOM_LINK_CLICKED,
        userId: this.getUserInfo.id,
        topic: this.entry.activityType.name,
        topicDescription: this.entry.title,
        itemDateTime: this.entry.dateStart
      })
    },

    openVideo() {
      let title = this.entry.title
      let author
      if (
        this.entry.activityType &&
        this.entry.activityType.name &&
        this.entry.teacher
      ) {
        title = this.entry.activityType.name
        author = `with ${this.entry.teacher}`
      }
      let videoIcon
      if (this.entry.activityType && this.entry.activityType.icon) {
        videoIcon = this.entry.activityType.icon
      }

      this.$nuxt.$emit('open-recorded-class-player', [
        {
          title,
          src: {
            url: this.entry.videos.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          meta: {
            videoId: this.entry.videos.id,
            author,
            videoIcon,
            videoType: 'RECORDED CLASS:'
          }
        }
      ])
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.LIVE_CLASSES_WATCH_RECORDED_VIDEO,
        userId: this.getUserInfo.id,
        topic: this.entry.activityType.name,
        topicDescription: this.entry.title,
        itemDateTime: this.entry.dateStart
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
    overflow-y: auto;
    max-height: 100%;
    border-radius: 40px !important;
    border: 10px solid var(--borderColor) !important;
    &-elipse {
      width: 156px;
      height: 156px;
      margin: 0 auto;
      top: calc(0px - 78px);
      left: calc(50% - 78px);
      background-color: white;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      border: unset !important;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 300;
      @media screen and (min-width: 960px) {
        width: 156px;
        height: 156px;
        position: static;
        top: auto;
        left: auto;
        z-index: auto;
        margin: 12px;
        border: solid 5px #68c453;
      }
      &-img {
        width: 120px;
        height: 120px;
        object-fit: contain;
        object-position: center;
        @media screen and (min-width: 960px) {
          width: 156px;
          height: 156px;
        }
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
        color: var(--textColor);
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
