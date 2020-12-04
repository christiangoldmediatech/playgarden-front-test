<template>
  <v-hover v-slot="{ hover }">
    <v-card class="lsess-table-entry clickable" :class="{ 'lsess-table-entry-active': isLive, 'lsess-table-entry-scaled': hover }" @click.stop="openLink">
      <div class="lsess-table-entry-live">
        <span v-if="isLive">Live</span>
        <img class="lsess-table-entry-live-icon mt-2 mr-2" :src="isLive ? '/svg/sessions-active-camera.svg' : '/svg/sessions-camera.svg'">
      </div>
      <div class="d-flex align-end mb-2">
        <img class="lsess-table-entry-type" :src="entry.activityType.icon">
        <div class="lsess-table-entry-title">
          {{ entry.activityType.name }}
        </div>
      </div>

      <div>
        {{ title }}
      </div>
    </v-card>
  </v-hover>
</template>

<script>
import { translateUTC } from '@/utils/dateTools.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export default {
  name: 'TableEntry',

  props: {
    entry: {
      type: Object,
      required: true
    }
  },

  computed: {
    isLive () {
      const today = dayjs()
      const start = translateUTC(this.entry.dateStart)
      const end = translateUTC(this.entry.dateEnd)

      return today.unix() >= start.unix() && today.unix <= end.unix()
    },

    title () {
      let str = this.entry.title.substr(0, 37).replace(/\s+$/, '')
      if (this.entry.title.lenght > str.length) {
        str += '...'
      }
      return str
    }
  },

  methods: {
    openLink () {
      this.$nuxt.$emit('open-entry-dialog', this.entry)
    }
  }
}
</script>

<style lang="scss" scoped>
.lsess {
  &-table {
    &-entry {
      position: relative;
      transition: transform 250ms;
      padding: 8px;
      &-active {
        border: solid 3px #F89838;
      }
      &-live {
        position: absolute;
        top: 0px;
        right: 0px;
        display: flex;
        align-items: center;
        &-icon {
          width: 24px;
          height: 24px;
        }
      }
      &-type{
        width: 60px;
        height: 60px;
        border-radius: 8px;
        margin-right: 8px;
        border: solid 3px #f2f2f2;
        object-fit: contain;
        object-position: center center;
      }
      &-title {
        font-size: 1.10rem;
        line-height: 1.25;
      }
      &-scaled {
        transform: scale(1.10);
        z-index: 1;
      }
    }
  }
}
</style>
