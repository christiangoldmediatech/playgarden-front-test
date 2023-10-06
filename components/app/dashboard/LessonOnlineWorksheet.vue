<template>
  <v-card
    :disabled="isDisabled"
    :nuxt="!noLinkMode"
    :exact="!noLinkMode"
    :to="to"
    :ripple="false"
    :class="cardClasses"
    data-test-id="lesson-online-worksheet-card"
  >
    <v-row no-gutters class="py-2 pr-2">
      <v-col cols="3" align-self="center" class="d-flex justify-center">
        <v-img height="40px" contain :src="circledComputer" />
      </v-col>

      <v-col cols="9" align-self="center">
        <div
          :class="{ 'dashboard-item-disabled': isDisabled }"
          class="text-uppercase dashboard-item-title text-disabled"
          data-test-id="lesson-online-worksheet-name"
        >
          {{ onlineWorksheet.name }}
        </div>

        <div class="text-caption grey--text">
          {{ $t('dailyLessons.onlineWorksheet.title') }}
        </div>

        <lesson-item-status v-if="isAdmin" tag="div" v-bind="{ item: onlineWorksheet }" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { LessonWorksheet } from '@/models'
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import LessonItemStatus from './LessonItemStatus.vue'

export default defineComponent({
  components: {
    LessonItemStatus
  },

  props: {
    onlineWorksheet: {
      type: Object as PropType<LessonWorksheet>,
      required: true
    },

    progress: {
      type: Number,
      default: 0
    },

    noLinkMode: {
      type: Boolean,
      default: false
    },

    to: {
      type: Object,
      default: undefined
    },

    enabled: {
      type: Boolean,
      default: false
    },

    active: {
      type: Boolean,
      default: false
    },

    isAdmin: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup (props) {
    const isDisabled = computed(() => props.progress < 100 || !props.enabled)

    const circledComputer = require('@/assets/png/dashboard/circled-computer.png')

    const cardClasses = computed(() => ({
      'dashboard-item': true,
      'dashboard-item-active': props.active
    }))

    return {
      cardClasses,
      circledComputer,
      isDisabled
    }
  }
})
</script>
