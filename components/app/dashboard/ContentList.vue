<template>
  <v-list class="py-0" dense>
    <v-list-item
      v-for="item in itemsComputed"
      :key="`list-${_uid}-item-${item.id}`"
      class="dashboard-item"
      active-class="dashboard-item-active"
      exact-active-class="dashboard-item-exact"
      :disabled="item.disabled"
      :nuxt="item.nuxt"
      :link="item.link"
      :exact="item.exact"
      :to="(item.to) ? item.to : ''"
      @click="loadDetailVideo(item)"
    >
      <v-list-item-avatar tile>
        <v-img
          :class="{ 'dashboard-panel-disabled': item.disabled }"
          :src="item.activityType.icon"
          contain
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          <span :class="['dashboard-item-activity-type', { 'dashboard-item-disabled': item.disabled }]">
            {{ item.activityType.name }}
          </span>
          <span
            v-if="item.name"
            :class="['dashboard-item-name', { 'dashboard-item-disabled': item.disabled }]"
          >
            with {{ item.name }}
          </span>
        </v-list-item-title>
        <v-list-item-subtitle :class="{ 'dashboard-item-disabled': item.disabled }">
          <span :class="{ 'dashboard-item-disabled': item.disabled }">{{ item.description }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle v-if="noLinkMode" :class="{ 'dashboard-item-disabled': item.disabled }">
          <span :class="{ 'dashboard-item-disabled': item.disabled }">
            Position: {{ item.viewed | getTimeToMMSS }}
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { APP_EVENTS } from '@/models'

export default {
  name: 'ContentList',

  filters: {
    getTimeToMMSS (viewed) {
      if (viewed) {
        const value = viewed.time
        const measuredTime = new Date(null)
        measuredTime.setSeconds(value)
        const MHSTime = measuredTime.toISOString().substr(14, 5)
        return MHSTime
      }
      return '00:00'
    }
  },

  props: {
    items: {
      type: Array,
      required: true
    },

    noLinkMode: {
      type: Boolean,
      required: false,
      default: false
    },

    itemType: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    itemsComputed () {
      let props = {
        nuxt: true,
        link: true,
        exact: true
      }
      if (this.noLinkMode) {
        props = {
          nuxt: false,
          link: false,
          exact: false,
          to: undefined
        }
      }
      return this.items.map((item) => {
        return {
          ...item,
          ...props
        }
      })
    }
  },
  methods: {
    loadDetailVideo (item) {
      switch (this.itemType) {
        case 'videoLesson':
          this.$nuxt.$emit(APP_EVENTS.DASHBOARD_VIDEO_LESSON_CLICKED, { type: item.activityType.name, description: item.description })
          break
        case 'activity':
          this.$nuxt.$emit(APP_EVENTS.DASHBOARD_ACTIVITY_CLICKED, { type: item.activityType.name, description: item.description })
          break
      }
      if (!item.to) {
        this.$nuxt.$emit('send-video', item)
      }
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  &-item {
    &.v-list-item--link:before {
      content: none;
    }
    &-disabled {
      color: rgba(0, 0, 0, 0.38) !important;
    }
    &-activity-type {
      font-size: 16px !important;
      font-weight: bold !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
    }
    &-name {
      font-size: 12px !important;
    }
    &-exact, &-active {
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
    }
  }
}
</style>
