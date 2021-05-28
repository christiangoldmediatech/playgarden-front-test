<template>
  <lesson-completed-card
    class="d-flex flex-column dashboard-content-card"
    height="100%"
  />
</template>

<script>
import LessonCompletedCard from '@/components/app/dashboard/LessonCompletedCard.vue'

export default {
  name: 'LessonCompleted',

  components: {
    LessonCompletedCard
  }
}
</script>
