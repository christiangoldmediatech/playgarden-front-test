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

<script lang="ts">
import { defineComponent, useRoute } from '@nuxtjs/composition-api'
import { APP_EVENTS } from '@/models'
import { computed, toRefs } from '@vue/composition-api'
import { useNuxtHelper } from '@/composables'

export default defineComponent({
  name: 'ContentList',

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

    enabled: {
      type: Boolean,
      required: false,
      default: true
    },

    itemType: {
      type: String,
      required: false,
      default: ''
    }
  },

  setup (props) {
    const { items, noLinkMode } = toRefs(props)
    const route = useRoute()

    const getTimeToMMSS = (viewed: any) => {
      if (viewed) {
        const value = viewed.time
        const measuredTime = new Date(0)
        measuredTime.setSeconds(value)
        const MHSTime = measuredTime.toISOString().substr(14, 5)
        return MHSTime
      }
      return '00:00'
    }

    const itemsComputed = computed(() => {
      const itemProps = {
        nuxt: true,
        link: true,
        exact: true
      } as any

      if (noLinkMode.value) {
        itemProps.nuxt = false
        itemProps.link = false
        itemProps.exact = false
      }

      return items.value.map((item: any) => {
        return {
          ...item,
          ...itemProps
        }
      })
    })

    const isItemDisabled = (item: any) => {
      return item.disabled || !props.enabled
    }

    const nuxt = useNuxtHelper()

    const loadDetailVideo = (item: any) => {
      switch (props.itemType) {
        case 'videoLesson':
          nuxt.$emit(APP_EVENTS.DASHBOARD_VIDEO_LESSON_CLICKED, { type: item.activityType.name, description: item.description })
          break
        case 'activity':
          nuxt.$emit(APP_EVENTS.DASHBOARD_ACTIVITY_CLICKED, { type: item.activityType.name, description: item.description })
          break
      }
      if (!item.to) {
        nuxt.$emit('send-video', item)
      }
    }
    return {
      itemsComputed,
      getTimeToMMSS,
      isItemDisabled,
      loadDetailVideo
    }
  }
})
</script>

<style lang="scss">
.dashboard {
  &-item {
    &-activity-type {
      font-size: 16px !important;
      font-weight: bold !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
      color: #606060;
    }
    &-name {
      font-size: 12px !important;
    }
  }
}
</style>
