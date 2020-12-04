<template>
  <v-overlay
    v-model="dialog"
    :dark="false"
    :light="true"
  >
    <div class="entry-container">
      <v-card class="entry-card">
        <template v-if="entry">
          <div class="green-line-bigger green-line-1" />
          <div class="green-line-bigger green-line-2" />
          <div class="entry-card-elipse">
            <img class="entry-card-elipse-img" :src="entry.activityType.icon">
          </div>

          <v-container class="entry-card-content">
            <div class="entry-card-activity-type pt-8 pb-4 text-center">
              {{ entry.activityType.name }}
            </div>

            <div class="entry-card-subheading pb-4 text-center">
              LIVE SESSION
            </div>

            <div class="entry-card-date pb-4 text-center">
              {{ date }}
            </div>

            <div class="entry-card-title pb-4">
              {{ entry.title }}
            </div>

            <div class="entry-card-description pb-4">
              {{ entry.description }}
            </div>

            <div class="entry-card-description pb-4 d-flex align-center">
              Ages: <span class="entry-card-info ml-3">{{ ages }}</span>
            </div>

            <div class="entry-card-description pb-4 d-flex align-center">
              Starts: <span class="entry-card-info ml-3">{{ time }}</span>
            </div>

            <div class="entry-card-description pb-4 d-flex align-center">
              Duration: <span class="entry-card-info ml-3">{{ entry.duration }} minutes</span>
            </div>

            <div v-if="!past" class="text-center pb-3">
              <v-btn
                class="white--text"
                color="#f89838"
                x-large
                :href="entry.link"
                :disabled="!isLive"
                target="_blank"
              >
                OPEN ZOOM LINK
              </v-btn>
            </div>

            <v-list v-if="!past" class="entry-card-calendar-links" dense mandatory>
              <v-list-group no-action>
                <template v-slot:prependIcon>
                  <img class="calendar-links-logo" src="@/assets/svg/sessions-camera.svg">
                </template>

                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      ADD TO CALENDAR
                    </v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item :href="googleCalendarLink" target="_blank">
                  <v-list-item-icon>
                    <img class="entry-card-calendar-links-logo" src="@/assets/svg/google-calendar.png">
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>
                      Google Calendar
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="downloadIcs">
                  <v-list-item-icon>
                    <img class="entry-card-calendar-links-logo" src="@/assets/svg/apple-calendar.png">
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>
                      Apple Calendar
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="downloadIcs">
                  <v-list-item-icon>
                    <img class="entry-card-calendar-links-logo" src="@/assets/svg/outlook-calendar.png">
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>
                      Outlook Calendar
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>

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
import dayjs from 'dayjs'
import { translateUTC } from '@/utils/dateTools.js'

export default {
  name: 'EntryDialog',

  data: () => {
    return {
      dialog: false,
      entry: null,
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  },

  computed: {
    isLive () {
      const today = dayjs()
      const start = translateUTC(this.entry.dateStart)
      const end = translateUTC(this.entry.dateEnd)

      return today.unix() >= start.unix() && today.unix() <= end.unix()
    },

    past () {
      const today = dayjs()
      const end = translateUTC(this.entry.dateEnd)

      return today.unix() >= end.unix()
    },

    ages () {
      if (this.entry && !isNaN(this.entry.ages)) {
        return `2${this.entry.ages > 2 ? ' - ' + this.entry.ages : ''}`
      }
      return 'All ages'
    },

    date () {
      if (this.entry) {
        const date = translateUTC(this.entry.dateStart)
        return `${this.months[date.month()]} ${date.date()}`
      }
      return ''
    },

    time () {
      if (this.entry) {
        const date = translateUTC(this.entry.dateStart)
        return `${date.hour()}:${(date.minute()).toString().padStart(2, '0')}`
      }
      return ''
    },

    googleCalendarLink () {
      if (this.entry) {
        const link = new URL('/calendar/render', 'https://calendar.google.com')
        link.searchParams.set('action', 'TEMPLATE')
        link.searchParams.set('text', this.entry.title)
        link.searchParams.set('dates', this.entry.dateStart | this.entry.dateEnd)
        link.searchParams.set('details', this.entry.description)
        return link.toString()
      }
      return ''
    },

    icsFile () {
      if (this.entry) {
        /* eslint-disable-next-line */
        const cal = new ics()
        cal.addEvent(this.entry.title, this.entry.description, 'Online', this.entry.dateStart, this.entry.dateEnd)
        return cal
      }
      return null
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
    downloadIcs () {
      if (this.icsFile) {
        this.icsFile.download()
      }
    }
  }
}
</script>

<style lang="scss">
.entry {
  &-container {
    max-width: 800px;
    max-height: 99vh;
    padding-top: 80px;
    overflow-y: hidden;
  }
  &-card {
    position: relative;
    overflow-y: visible;
    max-height: calc(99vh - 140px);
    &-elipse{
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
      &-img {
        width: 70px;
        height: 70px;
        max-width: 70px;
        max-height: 70px;
        object-fit: contain;
        object-position: center center;
      }
    }
    &-content {
      max-height: calc(99vh - 200px);
      overflow-y: scroll;
    }
    &-activity-type {
      font-size: 30px;
      font-weight: bold;
      line-height: 1.87;
    }
    &-subheading {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.5;
      letter-spacing: 3px;
    }
    &-date {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.35;
      text-transform: uppercase;
    }
    &-title {
      font-size: 24px;
      font-weight: bold;
      line-height: 1.13;
    }
    &-description {
      line-height: 1.5;
    }
    &-info {
      font-size: 24px;
      font-weight: 500;
      line-height: 1.46;
    }
    &-calendar-links {
      max-width: 330px;
      margin: 0 auto;
      &-logo {
        max-width: 32px;
        object-fit: contain;
        object-position: center;
      }
    }
  }
}
</style>
