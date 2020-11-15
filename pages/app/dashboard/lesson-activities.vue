<template>
  <lesson-activities-card show-favorites />
</template>

<script>
import LessonActivitiesCard from '@/components/app/dashboard/LessonActivitiesCard'

export default {
  name: 'LessonActivities',

  components: {
    LessonActivitiesCard
  }
}
</script>
