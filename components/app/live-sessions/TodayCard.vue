<template>
  <div
    class="lsess-daily-entry-container py-3 pl-2"
    :class="{ 'lsess-daily-entry-container-mobile': mobile }"
  >
    <div class="lsess-date">
      {{ time }}
    </div>
    <v-hover v-slot="{ hover }">
      <v-card
        class="lsess-card clickable"
        :style="{'--borderColor': entry.type === 'LiveClass' ? '#F89838' : '#68C453'}"
        :class="{ 'lsess-card-scaled': hover, 'lsess-card-active': isLive }"
        :disabled="block"
        @click.stop="openLink"
      >
        <img
          v-if="isLive"
          class="active-camera"
          src="@/assets/svg/sessions-active-camera.svg"
        >
        <v-row class="ma-0">
          <v-col class="flex-grow-0 flex-shrink-1">
            <div v-if="entry.teacher" class="pg-relative">
              <img
                class="lsess-card-activity-type ml-1 mt-1 pg-object-cover"
                :src="entry.teacher.img"
              />
              <img
                class="pg-w-[30px] pg-h-[30px] pg-bg-white pg-rounded-full pg-p-1 pg-shadow-sm pg-absolute pg-bottom-0 pg-right-[-5px]"
                :src="entry.activityType.icon"
              />
            </div>
            <div v-else>
              <img
                class="lsess-card-activity-type ml-1 mt-1"
                :src="entry.activityType.icon"
              />
            </div>
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
        <v-row class="ma-0">
          <v-col class="pt-0 lsess-card-description">
            {{ entry.description | descriptionFilter }}
          </v-col>
        </v-row>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TAG_MANAGER_EVENTS } from '@/models'
import { sameDay, isTomorrow } from '@/utils/dateTools.js'
import moment from 'moment'
import { formatTimezone } from '@/utils/dateTools'

export default {
  name: 'TodayCard',

  filters: {
    descriptionFilter(val) {
      if (val.length > 100) {
        return val.substr(0, 97) + '...'
      }
      return val
    }
  },

  props: {
    entry: {
      type: Object,
      required: true
    },

    block: {
      type: Boolean,
      required: false,
      default: false
    },

    mobile: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {
      days: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]
    }
  },

  computed: {
    ...mapGetters('auth', ['getUserInfo']),
    time() {
      const today = new Date()
      const date = new Date(this.entry.dateStart)
      let word = this.days[date.getDay()]
      if (date.getFullYear() === today.getFullYear()) {
        if (sameDay(today, date)) {
          word = 'Today'
        } else if (isTomorrow(date)) {
          word = 'Tomorrow'
        }
      }

      const start = moment(this.entry.dateStart)
      const { timezone } = this.getUserInfo
      return `${word} ${formatTimezone(start, {
        format: 'HH:mm',
        timezone,
        returnObject: false
      })}`
    },

    isLive() {
      const today = new Date()
      const start = new Date(this.entry.dateStart)
      const end = new Date(this.entry.dateEnd)

      return (
        today.getTime() >= start.getTime() - 5 * 60 * 1000 &&
        today.getTime() <= end.getTime() + 5 * 60 * 1000
      )
    }
  },

  methods: {
    openLink() {
      this.$nuxt.$emit('open-entry-dialog', this.entry)
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.LIVE_CLASSES_ITEM_CLICKED,
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
.lsess {
  &-daily-entry-container {
    width: calc(100% - 24px);
    max-width: calc(100% - 24px);
    &-mobile {
      width: 100%;
      max-width: 300px;
      padding: 4px;
      margin: 0px;
    }
  }
  &-date {
    text-align: right;
    font-size: 17px;
    margin-bottom: 10px;
  }
  &-card.v-card.v-sheet {
    box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.25);
  }
  &-card {
    transition: transform 250ms;
    border-radius: 20px !important;
    padding: 10px;
    border: 5px solid var(--borderColor) !important;
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
      border: solid 3px #f89838;
      .active-camera {
        position: absolute;
        width: 44px;
        height: 44px;
        top: calc(50% - 22px);
        left: calc(100% - 22px);
      }
    }
    &-title {
      font-size: 1.1rem;
      font-weight: bold;
      line-height: 1.13;
    }
    &-subtitle {
      font-size: 1.1rem;
      font-weight: 500;
      line-height: 1.5;
      color: #707070;
    }
    &-description {
      font-size: 1rem;
    }
  }
}
</style>
