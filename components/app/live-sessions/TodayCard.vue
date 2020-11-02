<template>
  <div class="lsess-daily-entry-container py-3 pl-2">
    <div class="lsess-date">
      {{ time }}
    </div>
    <v-hover v-slot="{ hover }">
      <v-card class="lsess-card clickable" :class="{ 'lsess-card-scaled': hover, 'lsess-card-active': isLive }" @click.stop="openLink">
        <img v-if="isLive" class="active-camera" src="/svg/sessions-active-camera.svg">
        <v-row class="mx-0">
          <v-col class="flex-grow-0 flex-shrink-1">
            <img class="lsess-card-activity-type" :src="entry.activityType.icon">
          </v-col>
          <v-col>
            <div class="d-flex flex-column justify-space-between fill-height">
              <div class="lsess-card-title">
                {{ entry.activityType.name }}
              </div>
              <div class="lsess-card-subtitle">
                {{ entry.title }}
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col class="pt-0">
            {{ entry.description }}
          </v-col>
        </v-row>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import { translateUTC } from '@/utils/dateTools.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import dayOfYear from 'dayjs/plugin/dayOfYear'

dayjs.extend(utc)
dayjs.extend(dayOfYear)

export default {
  name: 'TodayCard',

  props: {
    entry: {
      type: Object,
      required: true
    }
  },

  data: () => {
    return {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  },

  computed: {
    time () {
      const today = dayjs()
      const date = translateUTC(this.entry.dateStart)
      let word = this.days[date.day() - 1]

      if (date.year() === today.year()) {
        if (date.dayOfYear() === today.dayOfYear()) {
          word = 'Today'
        } else if (date.dayOfYear() === today.dayOfYear() + 1) {
          word = 'Tomorrow'
        }
      }

      return `${word} ${date.hour()}:${(date.minute()).toString().padStart(2, '0')}`
    },

    isLive () {
      const today = dayjs()
      const start = translateUTC(this.entry.dateStart)
      const end = translateUTC(this.entry.dateEnd)

      return today.unix() >= start.unix() && today.unix <= end.unix()
    }
  },

  methods: {
    openLink () {
      this.$nuxt.$emit('open-entry-dialog', this.entry)
    }
  }
}
</script>

<style lang="scss">
.lsess {
  &-daily-entry-container {
    width: calc(100% - 24px);
    max-width: calc(100% - 24px);
  }
  &-date {
    text-align: right;
    font-size: 17px;
    margin-bottom: 10px;
  }
  &-card {
    transition: transform 250ms;
    &-scaled {
      transform: scale(1.01);
      z-index: 1;
    }
    &-activity-type {
      width: 60px;
      max-width: 60px;
      height: 60px;
      max-height: 60px;
      object-fit: contain;
      object-position: center center;
    }
    &-active.v-card {
      border: solid 3px #F89838;
      .active-camera {
        position: absolute;
        width: 44px;
        height: 44px;
        top: calc(50% - 22px);
        left: calc(100% - 22px);
      }
    }
    &-title {
      font-size: 1.25rem;
      font-weight: bold;
      line-height: 1.13;
    }
    &-subtitle {
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.5;
      color: #707070;
    }
  }
}
</style>
