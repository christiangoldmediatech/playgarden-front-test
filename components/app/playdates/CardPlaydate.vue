<template>
  <v-card class="mx-auto" max-width="500" elevation="2" tile>
    <v-row>
      <v-col md="5" sm="12" class="align-self-center">
        <v-row justify="center" no-gutters>
          <v-col cols="8">
            <v-avatar size="120">
              <v-img
                max-width="120"
                alt="Educational Playdates"
                :src="require('@/assets/png/playdates/playdate.png')"
                class="align-self-center"
              />
            </v-avatar>
          </v-col>

          <v-col cols="12">
            <h6 class="text-capitalize text-center">
              {{ day }}: <span v-html="start" />
            </h6>
          </v-col>
        </v-row>
      </v-col>

      <v-col md="7" sm="12" class="ml-n5">
        <v-list-item three-line>
          <v-list-item-content>
            <div v-if="child.firstName && !finding" class="headline mb-2">
              {{ child.firstName | belongsTo }} Playdate
            </div>

            <v-list-item-title class="overline mb-1">
              With {{ specialist.fullName }}
            </v-list-item-title>

            <v-list-item-subtitle class="mt-3">
              JOIN YOUR FRIENDS!

              <v-row
                v-if="!finding"
                align="center"
                justify="center"
                justify-md="start"
                no-gutters
              >
                <v-img
                  v-for="(bImage, indexBI) in backpackImages"
                  :key="indexBI"
                  :class="{ 'ml-n3': indexBI }"
                  max-width="25"
                  :src="bImage"
                />

                <span class="ml-1">
                  {{ backpackImages.length }}/{{ playdate.spots }}
                </span>
              </v-row>
            </v-list-item-subtitle>

            <v-list-item-subtitle v-if="playdate.ages" class="mt-3">
              Ages recommended: {{ playdate.ages }}
            </v-list-item-subtitle>

            <v-list-item-subtitle class="mt-3">
              Duration: {{ duration }} minutes
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-btn class="white--text" color="#f89838" @click="dialog = true">
          Open Playdate
        </v-btn>
      </v-col>
    </v-row>

    <!-- CardPlaydatePopup -->
    <v-dialog
      v-model="dialog"
      content-class="elevation-0"
      width="100%"
      persistent
    >
      <v-row no-gutters justify="start">
        <v-btn
          class="top-left text-none"
          color="#f89838"
          text
          @click="dialog = false"
        >
          <v-icon class="mr-2" small left color="#f89838">
            mdi-less-than
          </v-icon>
          Back
        </v-btn>
      </v-row>

      <v-card
        class="mx-auto mt-16"
        max-width="700"
        max-height="700"
        elevation="2"
        tile
      >
        <div class="green-line green-line-1" />
        <div class="green-line green-line-2" />

        <v-row>
          <v-col md="5" sm="12" class="align-self-center">
            <v-row justify="center" no-gutters>
              <v-col align-self="center">
                <v-row justify="center">
                  <v-avatar size="120">
                    <v-img
                      max-width="120"
                      alt="Educational Playdates"
                      :src="require('@/assets/png/playdates/playdate.png')"
                      class="align-self-center"
                    />
                  </v-avatar>
                </v-row>

                <h6 class="text-capitalize text-center">
                  {{ day }}: <span v-html="start" />
                </h6>
              </v-col>
            </v-row>
          </v-col>

          <v-col md="7" sm="12" class="ml-n5">
            <v-list-item three-line>
              <v-list-item-content>
                <div v-if="child.firstName && !finding" class="headline mb-2">
                  {{ child.firstName | belongsTo }} Playdate
                </div>

                <v-list-item-title class="overline mb-1">
                  With {{ specialist.fullName }}
                </v-list-item-title>

                <v-list-item-subtitle class="mt-3">
                  JOIN YOUR FRIENDS!

                  <v-row
                    v-if="!finding"
                    align="center"
                    justify="center"
                    justify-md="start"
                    no-gutters
                  >
                    <v-img
                      v-for="(bImage, indexBI) in backpackImages"
                      :key="indexBI"
                      :class="{ 'ml-n3': indexBI }"
                      max-width="25"
                      :src="bImage"
                    />

                    <span class="ml-1">
                      {{ backpackImages.length }}/{{ playdate.spots }}
                    </span>
                  </v-row>
                </v-list-item-subtitle>

                <v-list-item-subtitle v-if="playdate.ages" class="mt-3">
                  Ages recommended: {{ playdate.ages }}
                </v-list-item-subtitle>

                <v-list-item-subtitle class="mt-3">
                  Duration: {{ duration }} minutes
                </v-list-item-subtitle>

                <v-list-item-subtitle v-if="!finding" class="mt-5">
                  <h5>who's going?</h5>

                  <child-select :value="child.id" hide-details disabled />
                </v-list-item-subtitle>

                <v-list-item-subtitle />
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>

        <v-row justify="center" no-gutters>
          <v-col cols="8" class="mb-5">
            <v-btn
              class="white--text"
              color="#f89838"
              target="_blank"
              block
              x-large
              :href="playdate.link"
            >
              Join Playdate
            </v-btn>

            <pg-ics-calendar :entry="icsEntry" />
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import dayjs from 'dayjs'
import { get } from 'lodash'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

import ChildSelect from '@/components/app/ChildSelect.vue'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

export default {
  name: 'CardPlaydate',

  components: {
    ChildSelect
  },

  props: {
    finding: Boolean,

    playdate: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    dialog: false,

    today: new Date().getUTCDay(),

    week: {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5
    }
  }),

  computed: {
    backpackImages () {
      return get(this.playdate, 'backpackChildrenImages', []).map(
        ({ image }) => image
      )
    },

    child () {
      return get(this.playdate, 'children', {})
    },

    day () {
      if (
        this.today === this.week[this.playdate.day] &&
        this.times.end.isAfter(new Date())
      ) {
        return 'Today'
      }

      return `Next ${this.playdate.day.toLowerCase()}`
    },

    duration () {
      return this.times.end.diff(this.times.start, 'm')
    },

    hasChild () {
      return Boolean(this.child.id)
    },

    icsEntry () {
      return {
        title: this.playdate.name,
        description: this.playdate.description,
        link: this.playdate.link,
        dateStart: this.times.start,
        dateEnd: this.times.end
      }
    },

    specialist () {
      return get(this.playdate, 'specialistUser.user', {})
    },

    start () {
      const startTime = this.times.start.format('hh:mm')
      const startMeridian = this.times.start.format('a')

      return `${startTime} <small class="grey--text">${startMeridian}</small>`
    },

    times () {
      const start = dayjs
        .utc(this.playdate.start, 'HH:mm:ss')
        .add((this.week[this.playdate.day] || 6) - this.today, 'days')
        .local()
      const end = dayjs
        .utc(this.playdate.end, 'HH:mm:ss')
        .add((this.week[this.playdate.day] || 6) - this.today, 'days')
        .local()

      return {
        start,
        end
      }
    }
  }
}
</script>
