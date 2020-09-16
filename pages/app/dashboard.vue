<template>
  <v-main>
    <v-container :class="{ 'dashboard-container': !$vuetify.breakpoint.smAndDown }" fluid>
      <v-row class="fill-height" justify="center">
        <v-col
          class="dashboard-column order-last order-md-first"
          cols="12"
          sm="8"
          md="5"
          lg="4"
          xl="3"
        >
          <dashboard-panel v-bind="{ lesson }" />
        </v-col>
        <v-col
          class="dashboard-column d-flex flex-column"
          cols="12"
          sm="12"
          md="7"
          lg="8"
          xl="9"
        >
          <!-- Tutorial row -->
          <v-row
            class="dashboard-tip-row flex-grow-0 flex-shrink-1"
            justify="center"
            justify-md="start"
            align="center"
            :no-gutters="$vuetify.breakpoint.smAndUp"
          >
            <v-col class="flex-shrink-1 flex-grow-0">
              <child-select v-model="selectedChild" hide-details />
            </v-col>

            <v-col class="text-center text-sm-right">
              <span class="font-weight-medium">
                First time using Playgarden?
              </span>

              <v-btn color="primary" nuxt text :to="{ name: 'app-onboarding' }">
                WATCH TUTORIAL HERE
              </v-btn>
            </v-col>
          </v-row>

          <v-row :class="['dashboard-content', { 'dashboard-mobile-content': $vuetify.breakpoint.sm, 'dashboard-xs-content': $vuetify.breakpoint.xs }]" no-gutters>
            <v-col class="dashboard-content-column" cols="12">
              <pg-loading v-if="$route.name === 'app-dashboard' || loading" />
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
import ChildSelect from '@/components/app/ChildSelect.vue'
import DashboardPanel from '@/components/app/dashboard/DashboardPanel.vue'
import DashboardMixin from '@/mixins/DashboardMixin.js'

export default {
  name: 'Dashboard',

  components: {
    ChildSelect,
    DashboardPanel
  },

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
          this.$router.push({
            name: 'app-dashboard-lesson-videos',
            query: { ...this.overrides, id: this.getNextId(this.videos.items) }
          })
        } else if (
          this.worksheets.progress < 100 &&
          this.worksheets.ONLINE
        ) {
          this.$router.push({
            name: 'app-dashboard-online-worksheet',
            query: { ...this.overrides, id: this.getNextId(this.worksheets.ONLINE) }
          })
        } else if (
          this.activities.progress < 100 &&
          this.activities.items.length
        ) {
          this.$router.push({
            name: 'app-dashboard-lesson-activities',
            query: { ...this.overrides, id: this.getNextId(this.activities.items) }
          })
        } else {
          this.$router.push({ name: 'app-dashboard-lesson-completed', query: { ...this.overrides } })
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

<style lang="scss" scoped>
.dashboard {
  &-container {
    height: calc(100vh - 64px);
    max-height: calc(100vh - 64px);
  }
  &-column {
    height: 100%;
    max-height: 100%;
  }
  &-content {
    height: calc(100% - 70px);
    &-column {
      max-height: 100%;
    }
  }
  &-tip-row {
    min-height: 70px;
  }
  &-mobile-content {
    min-height: calc(100vh - 162px);
  }
  &-xs-content {
    min-height: calc(100vh - 256px);
  }
}
</style>
