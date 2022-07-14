<template>
  <v-main v-if="loading">
    <pg-loading fullscreen />
  </v-main>
  <dashboard-layout
    v-else
    v-model="selectedChild"
    v-bind="{ lesson, loading, childId: childrenIds }"
  >
    <nuxt-child />
  </dashboard-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DashboardLayout from '@/components/app/dashboard/DashboardLayout.vue'
import DashboardMixin from '@/mixins/DashboardMixin.js'
import { APP_EVENTS, TAG_MANAGER_EVENTS } from '@/models'

export default {
  name: 'Dashboard',
  components: {
    DashboardLayout
  },
  mixins: [DashboardMixin],
  data: () => {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('auth', {
      playdateInvitationToken: 'getPlaydateInvitationToken',
      getUserInfo: 'getUserInfo'
    }),
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters('children', { allChildren: 'rows' }),
    ...mapGetters('children/lesson', {
      currentLessonId: 'getCurrentLessonId'
    }),
    overrideMode() {
      return !!(this.overrides.childId && this.overrides.lessonId)
    },
    childrenIds() {
      return this.currentChild && this.currentChild.length
        ? this.currentChild[0].id
        : 0
    },
    selectedChild: {
      get() {
        return this.currentChild[0].id
      },
      set(val) {
        if (val && val !== this.currentChild[0].id) {
          this.changeChild(val)
        }
      }
    }
  },
  watch: {
    '$route.name'() {
      this.$nuxt.$emit('close-curriculum-progress')
    },
    '$route.query'() {
      this.$nuxt.$emit('close-curriculum-progress')
    }
  },
  async created() {
    if (this.playdateInvitationToken) {
      return await this.$router.push({
        name: 'app-playdates-join',
        query: {
          token: this.playdateInvitationToken
        }
      })
    }

    this.loading = true

    if (this.overrideMode) {
      const currentChild = this.currentChild[0].id
      await this.getAllChildren()
      if (currentChild !== this.overrides.childId) {
        this.changeChild(this.overrides.childId, false)
      }
    } else {
      await this.getAllChildren()
    }
    // Load current lesson
    await this.handleLesson(true)
    // Setup update listener
    this.$nuxt.$on('dashboard-panel-update', (quietMode = false) => {
      this.handleLesson(false, quietMode)
    })
    // Setup update listener
    this.$nuxt.$on('dashboard-panel-update-redirect', (callback = () => {}) => {
      this.handleLesson(true, true).then(() => {
        callback()
      })
    })
  },
  mounted() {
    // GTM EVENTS
    this.$appEventBus.$on(APP_EVENTS.DASHBOARD_ONLINE_WORKSHEET_CLICKED, () => {
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.DASHBOARD_ONLINE_WORKSHEET_CLICKED,
        userId: this.getUserInfo.id,
        dayLetter: this.lesson.curriculumType.letter,
        dayNumber: this.lesson.day
      })
    })
  },
  beforeDestroy() {
    this.$nuxt.$off('dashboard-panel-update')
    this.$nuxt.$off('dashboard-panel-update-redirect')
    this.$appEventBus.$off(APP_EVENTS.DASHBOARD_ONLINE_WORKSHEET_CLICKED)
  },
  methods: {
    ...mapActions('children', { getAllChildren: 'get' }),
    ...mapActions('children/lesson', [
      'getCurrentLesson',
      'getCurrentLessonByChildrenId',
      'resetChild'
    ]),
    ...mapActions({ setChild: 'setChild' }),
    getNextId(items = []) {
      const item = items.find(({ viewed, completed }) => {
        if (completed === false || completed === null) {
          return true
        }
        return !viewed || (viewed && !viewed.completed)
      })
      if (item) {
        return item.id
      }
      if (items[0]) {
        return items[0].id
      }
      return undefined
    },
    changeChild(newId, redirect = true) {
      const child = this.allChildren.find(({ id }) => id === parseInt(newId))
      this.setChild({ value: [child], save: true })
      if (redirect) {
        this.handleLesson(true).then(() => {
          // this.$router.push({ name: 'app-dashboard' })
          // this.redirectDashboard()
        })
      }
    },
    async handleLesson(redirect = false, quietMode = true) {
      try {
        this.loading = quietMode
        if (
          this.overrideMode &&
          this.childrenIds === parseInt(this.overrides.childId)
        ) {
          await this.getCurrentLessonByChildrenId(this.overrides)
        } else {
          await this.getCurrentLesson({
            childrenIds: this.childrenIds
          })
        }

        if (redirect || (this.lessonCompleted && !this.overrideMode)) {
          this.redirectDashboard()
          this.loading = false
          return
        }
      } catch (e) {
        if (e && e.errorCode === 100 && !this.overrideMode) {
          this.$router.push({
            name: 'app-all-done'
          })
        }
      } finally {
        this.loading = false
      }
    },
    redirectDashboard() {
      // console.log('redirect method called from', from)
      if (this.lesson) {
        if (this.videos.progress < 100 && this.videos.items.length) {
          const route = this.generateNuxtRoute('lesson-videos', {
            id: this.getNextId(this.videos.items)
          })
          this.$router.push(route)
        } else if (this.worksheets.progress < 100 && this.worksheets.ONLINE) {
          const route = this.generateNuxtRoute('online-worksheet', {
            id: this.getNextId(this.worksheets.ONLINE)
          })
          this.$router.push(route)
        } else if (
          this.activities.progress < 100 &&
          this.activities.items.length
        ) {
          const route = this.generateNuxtRoute('lesson-activities', {
            id: this.getNextId(this.activities.items)
          })
          this.$router.push(route)
        } else if (this.lesson.id === this.currentLessonId) {
          this.$router.push(this.generateNuxtRoute('lesson-completed'))
        } else {
          const route = this.generateNuxtRoute('lesson-videos', {
            id: this.videos.items[0].id
          })
          this.$router.push(route)
        }
      } else if (
        this.lesson &&
        this.$route.name === 'app-dashboard-lesson-completed'
      ) {
        if (
          (this.videos.progress < 100 && this.videos.items.length) ||
          (this.worksheets.progress < 100 && this.worksheets.ONLINE) ||
          (this.activities.progress < 100 && this.activities.items.length)
        ) {
          this.$router.push({
            name: 'app-dashboard',
            query: { ...this.overrides }
          })
        }
      }
    }
  }
}
</script>
