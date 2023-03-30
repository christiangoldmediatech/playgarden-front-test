<template>
  <v-list class="entry-card-calendar-links" dense :disabled="isEmpty" mandatory>
    <v-list-group no-action>
      <template v-slot:prependIcon>
        <v-list-item-avatar size="45" tile>
          <v-img contain :src="require('@/assets/svg/sessions-camera.svg')" />
        </v-list-item-avatar>
      </template>

      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title class="!pg-text-lg pg-text-black">
            Add to calendar
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item :href="googleCalendarLink" target="_blank" @click="doSaveAttendance">
        <v-list-item-avatar size="25" tile>
          <v-img contain :src="require('@/assets/svg/google-calendar.png')" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            Google Calendar
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="downloadIcs">
        <v-list-item-avatar size="25" tile>
          <v-img contain :src="require('@/assets/svg/apple-calendar.png')" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            Apple Calendar
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="downloadIcs">
        <v-list-item-avatar size="25" tile>
          <v-img contain :src="require('@/assets/svg/outlook-calendar.png')" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            Outlook Calendar
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script>
import { mapActions } from 'vuex'
import dayjs from 'dayjs'

export default {
  name: 'PgIcsCalendar',

  props: {
    // * title
    // * description
    // * link
    // * dateStart
    // * dateEnd
    entry: {
      type: Object,
      default: null
    }
  },

  computed: {
    isEmpty () {
      return !this.icsFile && !this.googleCalendarLink
    },

    icsFile () {
      if (!this.entry) {
        return null
      }

      /* eslint-disable-next-line */
      const cal = new ics();

      cal.addEvent(
        this.entry.title,
        this.entry.description,
        this.entry.link,
        this.entry.dateStart,
        this.entry.dateEnd
      )

      return cal
    },

    googleCalendarLink () {
      if (!this.entry) {
        return ''
      }

      const link = new URL('/calendar/render', 'https://calendar.google.com')

      link.searchParams.set('action', 'TEMPLATE')
      link.searchParams.set('text', this.entry.title)
      link.searchParams.set('location', this.entry.link)
      link.searchParams.set(
        'dates',
        `${dayjs(this.entry.dateStart).format('YYYYMMDDTHHmmssZ')}/${dayjs(
          this.entry.dateEnd
        ).format('YYYYMMDDTHHmmssZ')}`
      )
      link.searchParams.set('details', this.entry.description)

      return link.toString()
    }
  },

  methods: {
    ...mapActions('live-sessions', ['saveAttendance']),

    doSaveAttendance () {
      if (this.entry.id) {
        this.saveAttendance(this.entry.id)
      }
    },

    downloadIcs () {
      if (this.icsFile) {
        this.icsFile.download()
        this.doSaveAttendance()
      }
    }
  }
}
</script>
