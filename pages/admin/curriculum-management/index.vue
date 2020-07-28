<template>
  <curriculum-lesson-data-table />
</template>

<script>
import CurriculumLessonDataTable from '~/components/admin/curriculum/CurriculumLessonDataTable'

export default {
  name: 'Index',

  layout: 'admin',

  components: {
    CurriculumLessonDataTable
  }
}
</script>
