<template>
  <dashboard-layout
    v-model="selectedChild"
    v-bind="{ lesson, loading }"
    preview-mode
  >
    <nuxt-child />
  </dashboard-layout>
</template>

<script>
import { mapActions } from 'vuex'
// import DashboardMixin from '@/mixins/DashboardMixin.js'

export default {
  name: 'Preview',

  layout: 'lesson-preview',

  data: () => {
    return {
      selectedChild: null,
      lesson: null,
      loading: true
    }
  },

  computed: {
    lessonId () {
      return this.$route.params.lessonId
    }
  },

  created () {
    this.getLessonPreview(this.lessonId).then((lesson) => {
      this.lesson = lesson
      this.loading = false
    })
  },

  methods: {
    ...mapActions('children/lesson', ['getLessonPreview'])
  }
}
</script>
