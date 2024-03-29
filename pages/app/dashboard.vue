<template>
  <v-main class="pt-10 pt-sm-6 pt-md-16 mt-8">
    <pg-loading :loading="loading" fullscreen>
      <dashboard-layout
        v-model="selectedChild"
        v-bind="{ lesson, loading, childId: childrenIds }"
      >
        <nuxt-child />
      </dashboard-layout>
    </pg-loading>
    <lesson-activity-player />
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DashboardLayout from '@/components/app/dashboard/DashboardLayout.vue'
import LessonActivityPlayer from '@/components/app/dashboard/LessonActivityPlayer.vue'
import DashboardMixin from '@/mixins/DashboardMixin.js'
import { APP_EVENTS, TAG_MANAGER_EVENTS } from '@/models'

export default {
  name: 'Dashboard',
  components: {
    DashboardLayout,
    LessonActivityPlayer
  },
  mixins: [DashboardMixin],
  data: () => {
    return {
      prevRoute: '',
      loading: false,
      fileUpload: false,
      progress: []
    }
  },
  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
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
    highestProgress() {
      return this.progress.reduce((acc, item) => {
        if (item.enabled) {
          return item.order
        }
        return acc
      }, 0)
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from.name
    })
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
      await this.getAllChildren(this.$route)
    }
    // Load course progress
    this.progress = await this.getCourseProgressByChildId({ id: this.childrenIds })
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

    this.resetChildren()
  },
  methods: {
    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),
    ...mapActions('children', { getAllChildren: 'get' }),
    ...mapActions('offline-worksheet', ['getOfflineWorksheetsByChildrenAndLesson']),
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
    getFirstId(items = []) {
      const item = items.sort((itemA, itemB) => itemA.order - itemB.order)[0]
      return (item && item.id) || undefined
    },
    changeChild(newId, redirect = true) {
      let child
      if (!Array.isArray(newId)) {
        child = this.allChildren.find(({ id }) => id === parseInt(newId))
      } else {
        child = this.allChildren.find(item => item.everyone === true)
      }
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
        } else if (this.children[0].everyone) {
          await this.getCurrentLesson({
            childrenIds: this.children[0].allIds
          })
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
    async redirectDashboard() {
      if (this.lesson) {
        const lessonDay = this.lesson.day
        const goToVideos = this.prevRoute === 'app-welcome'
        const curriculumType = this.lesson.curriculumType.letter
        const shouldRedirect = this.$route.query.shouldRedirect !== 'false' // This is use to avoid redirection loops
        const redirectToWorksheets = this.$route.query.redirectWorksheets === 'true'
        const cancelWelcomePage = this.highestProgress > 1
        const wasProgressMade = this.videos.progress > 0

        // We set this to avoid re-directions to lesson videos
        this.prevRoute = ''

        // Tutorial redirect
        const { tutorial, tutorialStep, tutorialIntroDaysRedirect, tutorialVirtualPreschoolRedirect } = this.$route.query
        const tutorialQueryParams = { tutorial, tutorialStep, tutorialIntroDaysRedirect, tutorialVirtualPreschoolRedirect }
        if (tutorialQueryParams.tutorial) {
          if (this.$route.name === 'app-dashboard-lesson-videos') {
            return
          }
          const route = this.generateNuxtRoute('lesson-videos', {
            id: this.getFirstId(this.videos.items),
            ...tutorialQueryParams
          })
          this.$router.push(route)
          return
        }

        if ((lessonDay === 2 || lessonDay === 3) && curriculumType === 'In' && shouldRedirect && !wasProgressMade && !cancelWelcomePage) {
          this.$router.push({ name: 'app-welcome', query: { step: lessonDay } })
          return
        }

        if (redirectToWorksheets) {
          this.$router.push({ name: 'app-dashboard-online-worksheet' })
          return
        }

        if (((lessonDay === 1 || lessonDay === 2 || lessonDay === 3) && curriculumType === 'In') && !redirectToWorksheets && goToVideos) {
          this.$router.push(this.generateNuxtRoute('lesson-videos', {
            id: this.getNextId(this.videos.items)
          }))
          return
        }

        if (this.videos.progress < 100 && this.videos.items.length) {
          const route = this.generateNuxtRoute('lesson-videos', {
            id: this.getNextId(this.videos.items)
          })
          this.$router.push(route)
        } else if ((this.worksheets.progress < 100 && !this.worksheets.isEmpty) && this.worksheets.ONLINE) {
          const route = this.generateNuxtRoute('online-worksheet', {
            id: this.getNextId(this.worksheets.ONLINE)
          })
          this.$router.push(route)
        } else if (curriculumType === 'In') {
          const offlineWorksheets = this.lesson.worksheets.filter((worksheet) => worksheet.type === 'OFFLINE')
          this.fileUpload = (offlineWorksheets && offlineWorksheets.length > 0)
          const uploadedFiles = await this.getUploadedFiles()
          let pathPage = this.fileUpload ? this.generateNuxtRoute('offline-worksheet', { ...this.$route.query }) : this.generateNuxtRoute('lesson-completed')

          if (uploadedFiles && uploadedFiles.length > 0) {
            pathPage = this.generateNuxtRoute('lesson-completed')
          }

          this.$router.push(pathPage)
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
    },
    async getUploadedFiles() {
      return await this.$axios.$get(`/worksheets/children/${this.childrenIds}/lesson/${this.lesson.id}`)
    },
    resetChildren() {
      if (Array.isArray(this.selectedChild)) {
        this.changeChild(this.selectedChild[0], false)
      }
    }
  }
}
</script>
