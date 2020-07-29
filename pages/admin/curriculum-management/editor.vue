<template>
  <curriculum-lesson-editor />
</template>

<script>
import CurriculumLessonEditor from '@/components/admin/curriculum/CurriculumLessonEditor'

export default {
  name: 'Editor',

  layout: 'admin',

  components: {
    CurriculumLessonEditor
  }
}
</script>
