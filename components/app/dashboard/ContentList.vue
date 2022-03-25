<template>
  <transition name="fade" mode="out-in">
    <div v-if="itemsComputed.length === 0">
      <v-skeleton-loader
        v-for="n in NUMBER_OF_CARDS_IN_SKELETON"
        :key="n"
        height="100"
        type="list-item-avatar-two-line"
        class="pt-3 dashboard-item customSkeletonLoader"
        loading
      />
    </div>
    <main v-else class="dailyLessonsScrolView">
      <template v-for="item in itemsComputed">
        <v-card
          v-if="$vuetify.breakpoint.mdAndUp"
          :key="`list-${_uid}-item-${item.id}`"
          class="dashboard-item"
          active-class="dashboard-item-active"
          exact-active-class="dashboard-item-exact"
          :ripple="false"
          :disabled="item.disabled"
          :nuxt="item.nuxt"
          :link="item.link"
          :exact="item.exact"
          :to="!noLinkMode && item.to ? item.to : undefined"
          v-on="{
            click: noLinkMode
              ? undefined
              : () => {
                loadDetailVideo(item)
              }
          }"
        >
          <v-row no-gutters align="center">
            <v-col cols="4">
              <v-img
                class="dashboard-item-image"
                :class="{ 'lesson-panel-disabled': isItemDisabled(item) }"
                :src="item.thumbnail"
                cover
                height="100px"
              />
            </v-col>

            <v-col cols="8">
              <div class="mx-2 mt-4 mb-2">
                <span
                  :class="[
                    'dashboard-item-activity-type',
                    { 'dashboard-item-disabled': isItemDisabled(item) }
                  ]"
                >
                  {{ item.activityType.name }}
                </span>
                <span
                  v-if="item.name"
                  :class="[
                    'dashboard-item-name',
                    { 'dashboard-item-disabled': isItemDisabled(item) }
                  ]"
                >
                  with {{ item.name }}
                </span>
              </div>

              <div class="mx-2 mb-3 text-body-2">
                <span
                  :class="{ 'dashboard-item-disabled': isItemDisabled(item) }"
                >
                  {{ item.description }}
                </span>
              </div>

              <div
                v-if="isAdmin"
                class="mx-2 mt-n3 text-body-2"
                :class="{ 'dashboard-item-disabled': isItemDisabled(item) }"
              >
                <lesson-item-status v-bind="{ item }" />
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-col
          v-if="$vuetify.breakpoint.smAndDown"
          :key="`list-${_uid}-item-${item.id}`"
          cols="5"
          class="px-0"
        >
          <v-card
            class="dashboard-item pb-1"
            active-class="dashboard-item-active"
            exact-active-class="dashboard-item-exact"
            :ripple="false"
            :disabled="item.disabled"
            :nuxt="item.nuxt"
            :link="item.link"
            :exact="item.exact"
            :to="!noLinkMode && item.to ? item.to : undefined"
            height="90%"
            v-on="{
              click: noLinkMode
                ? undefined
                : () => {
                  loadDetailVideo(item)
                }
            }"
          >
            <v-img
              class="dashboard-item-image"
              :class="{ 'lesson-panel-disabled': isItemDisabled(item) }"
              :src="item.thumbnail"
              cover
              height="100px"
            />

            <div class="mx-2 mt-4 mb-2">
              <span
                :class="[
                  'dashboard-item-activity-type',
                  { 'dashboard-item-disabled': isItemDisabled(item) }
                ]"
              >
                {{ item.activityType.name }}
              </span>
              <br>
              <span
                v-if="item.name"
                :class="[
                  'dashboard-item-name',
                  { 'dashboard-item-disabled': isItemDisabled(item) }
                ]"
              >
                with {{ item.name }}
              </span>
            </div>
            <div class="mx-2 mb-3 text-body-2">
              <span
                :class="{ 'dashboard-item-disabled': isItemDisabled(item) }"
              >
                {{ item.description }}
              </span>
            </div>

            <div
              v-if="isAdmin"
              class="mx-2 mt-n3 text-body-2"
              :class="{ 'dashboard-item-disabled': isItemDisabled(item) }"
            >
              <lesson-item-status v-bind="{ item }" />
            </div>
          </v-card>
        </v-col>
      </template>
    </main>
  </transition>
</template>

<script lang="ts">
import { defineComponent, useRoute } from '@nuxtjs/composition-api'
import { APP_EVENTS } from '@/models'
import { computed, toRefs } from '@vue/composition-api'
import { useNuxtHelper } from '@/composables'
import LessonItemStatus from './LessonItemStatus.vue'
const NUMBER_OF_CARDS_IN_SKELETON = 3
export default defineComponent({
  name: 'ContentList',
  components: {
    LessonItemStatus
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
  setup(props) {
    const { items, noLinkMode } = toRefs(props)
    const route = useRoute()
    const isAdmin = computed(() => {
      return route.value.name?.includes('admin')
    })
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
        itemProps.nuxt = undefined
        itemProps.link = undefined
        itemProps.exact = undefined
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
          nuxt.$emit(APP_EVENTS.DASHBOARD_VIDEO_LESSON_CLICKED, {
            type: item.activityType.name,
            description: item.description
          })
          break
        case 'activity':
          nuxt.$emit(APP_EVENTS.DASHBOARD_ACTIVITY_CLICKED, {
            type: item.activityType.name,
            description: item.description
          })
          break
      }
      if (!item.to) {
        nuxt.$emit('send-video', item)
      }
    }
    return {
      isAdmin,
      itemsComputed,
      getTimeToMMSS,
      isItemDisabled,
      loadDetailVideo,
      NUMBER_OF_CARDS_IN_SKELETON
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

<style lang="scss" scoped>
.customSkeletonLoader {
  ::v-deep {
    .v-skeleton-loader__avatar {
      border-radius: 10px;
      height: 85px;
      width: 120px;
    }
    .v-skeleton-loader__paragraph,
    .v-skeleton-loader__sentences {
      display: grid;
      grid-gap: 0.8rem;
    }
  }
}
</style>
