<template>
  <v-main>
    <dashboard-layout
      v-if="lesson"
      v-model="selectedChild"
      v-bind="{ lesson, loading }"
      preview-mode
    >
      <nuxt-child />
    </dashboard-layout>
    <lesson-activity-player />
  </v-main>
</template>

<script>
import { mapActions } from 'vuex'
import DashboardLink from '@/mixins/DashboardLinkMixin.js'
import DashboardLayout from '@/components/app/dashboard/DashboardLayout.vue'
import LessonActivityPlayer from '@/components/app/dashboard/LessonActivityPlayer.vue'
import previewChild from '@/utils/consts/previewChild.json'

export default {
  name: 'Preview',

  components: {
    DashboardLayout,
    LessonActivityPlayer
  },

  layout: 'lesson-preview-mode',

  mixins: [DashboardLink],

  data: () => {
    return {
      selectedChild: previewChild,
      lesson: null,
      loading: true
    }
  },

  computed: {
    lessonId() {
      return this.$route.params.lessonId
    }
  },

  async mounted() {
    const { token } = this.$route.query
    if (token) {
      this.$axios.setToken(`Bearer ${token}`)
    }

    await this.$store.dispatch('setChild', {
      value: [previewChild],
      save: true
    })

    this.lesson = await this.getLessonPreview(this.lessonId)

    this.loading = false
    if (this.$route.name === 'admin-curriculum-management-lessonId-preview') {
      this.$router.push(
        this.generateNuxtRoute('lesson-videos', {
          id: this.lesson.videos[0].id
        })
      )
    }

    const curriculumTypes = await this.$axios.$get('/curriculum-types')
    this.$store.commit('admin/curriculum/SET_TYPES', curriculumTypes)
  },

  methods: {
    ...mapActions('children/lesson', ['getLessonPreview'])
  }
}
</script>
