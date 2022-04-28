<template>
  <pg-video-dialog
    max-width="1280"
    max-height="850"
    persistent
    v-bind="{ value }"
  >
    <lesson-completed-card
      class="pos-relative pt-8"
      show-return
      @close="close"
      @next-finished="handleNextFinished"
    >
      <div class="pos-absolute pos-top-0 pos-left-0 w-100">
        <div class="green-line-md green-line-1" />
        <div class="green-line-md green-line-2" />
      </div>
    </lesson-completed-card>
  </pg-video-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import LessonCompletedCard from '@/components/app/dashboard/LessonCompletedCard.vue'

export default defineComponent({
  name: 'LessonActivitiesFinishedDialog',

  components: {
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
