<template>
  <pg-video-dialog
    max-width="1280"
    max-height="850"
    persistent
    v-bind="{ value }"
  >
    <lesson-schedule-finished :value="true" should-advance @advance="handleNextFinished" />
  </pg-video-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import LessonCompletedCard from '@/components/app/dashboard/LessonCompletedCard.vue'
import LessonScheduleFinished from '@/components/app/dashboard/worksheets/LessonSceduleFinished.vue'

export default defineComponent({
  name: 'LessonActivitiesFinishedDialog',

  components: {
    LessonScheduleFinished,
    LessonCompletedCard
  },

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  setup(_, { emit }) {
    function handleNextFinished(): void {
      emit('next-finished')
    }

    function close(): void {
      emit('input', false)
    }

    return {
      handleNextFinished,
      close
    }
  }
})
</script>
