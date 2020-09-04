<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="5" md="4" lg="3">
          <dashboard-panel v-bind="{ lesson }" />
        </v-col>

        <v-col cols="12" sm="7" md="8" lg="9">
          <v-row align="center" class="px-3">
            <!-- <v-btn v-if="allChildren.length > 1" color="primary" :to="{ name: 'app-pick-child' }">
              Change Children
            </v-btn> -->
            <v-col cols="12" sm="6" lg="3" xl="2">
              <child-select v-model="selectedChild" hide-details />
            </v-col>

            <!-- <v-btn color="primary" @click.stop="onResetChild">
              RESET CHILD
            </v-btn> -->

            <v-spacer />

            <span class="font-weight-medium">First time using Playgarden?</span>

            <v-btn color="primary" nuxt text :to="{ name: 'app-onboarding' }">
              WATCH TUTORIAL HERE
            </v-btn>
          </v-row>

          <v-row>
            <v-col class="pt-5">
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

  created () {
    this.getAllChildren()
    this.getCurrentLesson(true)

    this.$nuxt.$on('dashboard-panel-update', () => {
      this.getCurrentLesson()
    })
    this.selectedChild = this.currentChild[0].id
  },

  beforeDestroy () {
    this.$nuxt.$off('dashboard-panel-update')
  },

  methods: {
    ...mapActions('children', { getAllChildren: 'get' }),
    ...mapActions('children/lesson', ['getCurrentLessonByChildrenId', 'resetChild']),
    ...mapActions({ setChild: 'setChild' }),

    changeChild (newId) {
      const child = this.allChildren.find(({ id }) => id === newId)
      this.setChild({ value: [child], save: true })
      this.$router.push({ name: 'app-dashboard' })
    },

    async onResetChild () {
      await this.resetChild({ lessonId: 20, childId: this.childrenIds })
      this.$nuxt.$emit('dashboard-panel-update')
    },

    async getCurrentLesson (redirect = false) {
      try {
        await this.getCurrentLessonByChildrenId({
          childrenIds: this.childrenIds
        })

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
            query: { id: this.getNextId(this.videos) }
          })
        } else if (this.worksheetsCompletionRate < 100 && this.worksheets.ONLINE) {
          this.$router.push({
            name: 'app-dashboard-online-worksheet',
            query: { id: this.getNextId(this.worksheets.ONLINE) }
          })
        } else if (this.activitiesCompletionRate < 100 && this.activities.length) {
          this.$router.push({
            name: 'app-dashboard-lesson-activities',
            query: { id: this.getNextId(this.activities) }
          })
        } else {
          this.$router.push({ name: 'app-dashboard-lesson-completed' })
        }
      } else if (this.lesson && this.$route.name === 'app-dashboard-lesson-completed') {
        if (
          (this.videosCompletionRate < 100 && this.videos.length) ||
          (this.worksheetsCompletionRate < 100 && this.worksheets.ONLINE) ||
          (this.activitiesCompletionRate < 100 && this.activities.length)
        ) {
          this.$router.push({ name: 'app-dashboard' })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-max-width {
  max-width: 471px;
}

.titleOnDashboard {
  font-weight: 500 !important;
  color: $pg-black !important;
}
</style>
