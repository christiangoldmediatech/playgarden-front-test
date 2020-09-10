<template>
  <v-main>
    <v-container :class="{ 'dashboard-container': !$vuetify.breakpoint.mobile }" :style="{ '--headerHeight': headerHeight }" fluid>
      <v-row class="dashboard-row" justify="center">
        <v-col class="order-last order-md-first" cols="12" sm="8" md="4" lg="3">
          <dashboard-panel v-bind="{ lesson }" />
        </v-col>
        <v-col class="d-flex flex-column" cols="12" md="8" lg="9">
          <!-- Tutorial row -->
          <v-row class="flex-grow-0 flex-shrink-1 mb-6" align="center" no-gutters>
            <v-col class="flex-shrink-1 flex-grow-0">
              <child-select v-model="selectedChild" hide-details />
            </v-col>

            <!-- <v-btn color="primary" @click.stop="onResetChild">
              RESET CHILD
            </v-btn> -->

            <!-- <span>
              {{ breakpoints }}
            </span> -->

            <v-col class="text-center text-md-right">
              <span class="font-weight-medium">First time using Playgarden?</span>

              <v-btn color="primary" nuxt text :to="{ name: 'app-onboarding' }">
                WATCH TUTORIAL HERE
              </v-btn>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12">
              <v-row
                v-if="$route.name === 'app-dashboard'"
                align="center"
                fill-height
                justify="center"
              >
                <v-col class="text-center" cols="4">
                  <div>
                    <img class="logo-img" src="@/assets/svg/logo.svg">
                  </div>

                  <v-progress-linear color="primary" indeterminate :size="20" />
                </v-col>
              </v-row>
              <nuxt-child />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DashboardMixin from '@/mixins/Dashboard.js'
import DashboardPanel from '@/components/app/dashboard/DashboardPanel'
import ChildSelect from '@/components/app/ChildSelect.vue'

export default {
  name: 'Dashboard',

  components: {
    DashboardPanel,
    ChildSelect
  },

  mixins: [DashboardMixin],

  data: () => {
    return {
      selectedChild: null
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters('children', { allChildren: 'rows' }),

    // breakpoints () {
    //   const keys = Object.keys(this.$vuetify.breakpoint).filter(key => this.$vuetify.breakpoint[key])
    //   return keys.join(', ')
    // },

    overrides () {
      return {
        childId: this.$route.query.childId,
        lessonId: this.$route.query.lessonId
      }
    },

    overrideMode () {
      if (this.overrides.childId && this.overrides.lessonId) {
        return true
      }
      return false
    },

    childrenIds () {
      // const ids = (this.currentChild
      //   ? this.currentChild.map(({ id }) => id)
      //   : []
      // ).join(',')

      // return `[${ids}]`
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

    changeChild (newId, redirect = true) {
      const child = this.allChildren.find(({ id }) => id === parseInt(newId))
      this.setChild({ value: [child], save: true })
      if (redirect) {
        this.handleLesson()
        this.$router.push({ name: 'app-dashboard' })
      }
    },

    async onResetChild () {
      await this.resetChild({ lessonId: 20, childId: this.childrenIds })
      this.$nuxt.$emit('dashboard-panel-update')
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
        if (this.videosCompletionRate < 100 && this.videos.length) {
          this.$router.push({
            name: 'app-dashboard-lesson-videos',
            query: { ...this.overrides, id: this.getNextId(this.videos) }
          })
        } else if (this.worksheetsCompletionRate < 100 && this.worksheets.ONLINE) {
          this.$router.push({
            name: 'app-dashboard-online-worksheet',
            query: { ...this.overrides, id: this.getNextId(this.worksheets.ONLINE) }
          })
        } else if (this.activitiesCompletionRate < 100 && this.activities.length) {
          this.$router.push({
            name: 'app-dashboard-lesson-activities',
            query: { ...this.overrides, id: this.getNextId(this.activities) }
          })
        } else {
          this.$router.push({ name: 'app-dashboard-lesson-completed', query: { ...this.overrides } })
        }
      } else if (this.lesson && this.$route.name === 'app-dashboard-lesson-completed') {
        if (
          (this.videosCompletionRate < 100 && this.videos.length) ||
          (this.worksheetsCompletionRate < 100 && this.worksheets.ONLINE) ||
          (this.activitiesCompletionRate < 100 && this.activities.length)
        ) {
          this.$router.push({ name: 'app-dashboard', query: { ...this.overrides } })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  max-height: calc(100vh - var(--headerHeight)) !important;
  height: calc(100vh - var(--headerHeight)) !important;
}

.dashboard-row {
  height: 100%;
}

.menu-max-width {
  max-width: 471px;
}

.titleOnDashboard {
  font-weight: 500 !important;
  color: $pg-black !important;
}
</style>
