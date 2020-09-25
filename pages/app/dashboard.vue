<template>
  <dashboard-layout v-model="selectedChild" v-bind="{ lesson, loading }">
    <nuxt-child />
  </dashboard-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DashboardMixin from '@/mixins/DashboardMixin.js'

export default {
  name: 'Dashboard',

  mixins: [DashboardMixin],

  data: () => {
    return {
      selectedChild: null,
      loading: false
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters('children', { allChildren: 'rows' }),

    overrideMode () {
      if (this.overrides.childId && this.overrides.lessonId) {
        return true
      }
      return false
    },

    childrenIds () {
      return this.currentChild[0].id
    }
  },

  watch: {
    '$route.name' () {
      this.redirectDashboard()
    },

    selectedChild (val) {
      if (val && val !== this.currentChild[0].id) {
        this.changeChild(val)
      }
    }
  },

  async created () {
    const currentChild = this.currentChild[0].id
    if (this.overrideMode) {
      await this.getAllChildren()
      if (currentChild !== this.overrides.childId) {
        this.changeChild(this.overrides.childId, false)
      }
    } else {
      this.getAllChildren()
    }

    // Load current lesson
    this.handleLesson(true)

    // Setup update listener
    this.$nuxt.$on('dashboard-panel-update', () => {
      this.handleLesson()
    })

    // Set selected child
    this.selectedChild = this.currentChild[0].id
  },

  beforeDestroy () {
    this.$nuxt.$off('dashboard-panel-update')
  },

  methods: {
    ...mapActions('children', { getAllChildren: 'get' }),
    ...mapActions('children/lesson', ['getCurrentLesson', 'getCurrentLessonByChildrenId', 'resetChild']),
    ...mapActions({ setChild: 'setChild' }),

    getNextId (items = []) {
      const { id } = items.find(({ viewed, complete }) => {
        if (complete) {
          return !complete
        }
        return !viewed || (viewed && !viewed.complete)
      })
      return id
    },

    changeChild (newId, redirect = true) {
      const child = this.allChildren.find(({ id }) => id === parseInt(newId))
      this.setChild({ value: [child], save: true })
      if (redirect) {
        this.loading = true
        this.handleLesson().then(() => {
          this.$router.push({ name: 'app-dashboard' })
          this.loading = false
        })
      }
    },

    async handleLesson (redirect = false) {
      try {
        if (this.overrideMode && this.childrenIds === parseInt(this.overrides.childId)) {
          await this.getCurrentLessonByChildrenId(this.overrides)
        } else {
          await this.getCurrentLesson({
            childrenIds: this.childrenIds
          })
        }
        if (redirect) {
          this.redirectDashboard()
        }
      } catch (e) {
        return Promise.reject(e)
      }
    },

    redirectDashboard () {
      if (this.lesson && this.$route.name === 'app-dashboard') {
        if (this.videos.progress < 100 && this.videos.items.length) {
          const route = this.generateNuxtRoute('lesson-videos', { id: this.getNextId(this.videos.items) })
          this.$router.push(route)
        } else if (
          this.worksheets.progress < 100 &&
          this.worksheets.ONLINE
        ) {
          const route = this.generateNuxtRoute('online-worksheet', { id: this.getNextId(this.worksheets.ONLINE) })
          this.$router.push(route)
        } else if (
          this.activities.progress < 100 &&
          this.activities.items.length
        ) {
          const route = this.generateNuxtRoute('lesson-activities', { id: this.getNextId(this.activities.items) })
          this.$router.push(route)
        } else {
          this.$router.push(this.generateNuxtRoute('lesson-completed'))
        }
      } else if (this.lesson && this.$route.name === 'app-dashboard-lesson-completed') {
        if (
          (this.videos.progress < 100 && this.videos.items.length) ||
          (this.worksheets.progress < 100 && this.worksheets.ONLINE) ||
          (this.activities.progress < 100 && this.activities.items.length)
        ) {
          this.$router.push({ name: 'app-dashboard', query: { ...this.overrides } })
        }
      }
    }
  }
}
</script>
