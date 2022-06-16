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
import DashboardLink from '@/mixins/DashboardLinkMixin.js'
import DashboardLayout from '@/components/app/dashboard/DashboardLayout.vue'

export default {
  name: 'Preview',

  components: {
    DashboardLayout
  },

  layout: 'lesson-preview',

  mixins: [DashboardLink],

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
      if (this.$route.name === 'admin-curriculum-management-lessonId-preview') {
        this.$router.push(this.generateNuxtRoute('lesson-videos', { id: lesson.videos[0].id }))
      }
    })
  },

  methods: {
    ...mapActions('children/lesson', ['getLessonPreview'])
  }
}
</script>
