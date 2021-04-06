<template>
  <lesson-grades-editor />
</template>

<script>
import LessonGradesEditor from '@/components/admin/lesson-grades/LessonGradesEditor'

export default {
  name: 'Editor',

  layout: 'admin',

  components: {
    LessonGradesEditor
  }
}
</script>
