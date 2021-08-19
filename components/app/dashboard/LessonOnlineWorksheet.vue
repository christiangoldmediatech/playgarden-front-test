<template>
  <v-card
    :disabled="isDisabled"
    :nuxt="!noLinkMode"
    :exact="!noLinkMode"
    :to="to"
    :ripple="false"
    data-test-id="lesson-online-worksheet-card"
    class="dashboard-item"
    active-class="dashboard-item-active"
    exact-active-class="dashboard-item-exact"
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
          Online Worksheet
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { LessonWorksheet } from '@/models'
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

export default defineComponent({
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
    }
  },

  setup (props) {
    const isDisabled = computed(() => props.progress < 100 || !props.enabled)

    const circledComputer = require('@/assets/png/dashboard/circled-computer.png')

    return {
      circledComputer,
      isDisabled
    }
  }
})
</script>
