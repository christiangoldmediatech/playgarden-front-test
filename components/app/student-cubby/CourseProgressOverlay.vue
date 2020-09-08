<template>
  <v-overlay class="justify-start" :dark="false" :value="show">
    <v-btn
      class="top-left text-none white--text px-4"
      text
      x-large
      @click.stop="close"
    >
      <v-icon left>
        mdi-less-than
      </v-icon>
      Back
    </v-btn>
    <perfect-scrollbar>
      <v-container class="panel-container" fill-height fluid>
        <v-row class="flex-nowrap">
          <!-- <v-col v-for="i in 5" :key="`test-${i}`" cols="3">
            <v-card height="100%">
              <v-card-title>
                Test
              </v-card-title>

              <v-card-text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam consequuntur, quod ipsa rerum illo blanditiis. Impedit ex commodi a similique provident rem deserunt dicta adipisci soluta nisi minima, libero quis?
              </v-card-text>
            </v-card>
          </v-col> -->
          <v-col
            v-for="lesson in lessons"
            :key="`curriculum-lesson-progress-2-${lesson.id}`"
            cols="3"
          >
            <dashboard-panel
              v-bind="{ lesson }"
              display-mode
            />
          </v-col>
        </v-row>
        <!-- <v-row class="flex-nowrap">
          <v-col
            v-for="lesson in lessons"
            :key="`curriculum-lesson-progress-${lesson.id}`"
            cols="3"
          >
            <dashboard-panel
              v-bind="{ lesson }"
              display-mode
            />
          </v-col>

          <v-col
            v-for="lesson in lessons"
            :key="`curriculum-lesson-progress-2-${lesson.id}`"
            cols="3"
          >
            <dashboard-panel
              v-bind="{ lesson }"
              display-mode
            />
          </v-col>

          <v-col
            v-for="lesson in lessons"
            :key="`curriculum-lesson-progress-3-${lesson.id}`"
            cols="3"
          >
            <dashboard-panel
              v-bind="{ lesson }"
              display-mode
            />
          </v-col>
        </v-row> -->
      </v-container>
    </perfect-scrollbar>
  </v-overlay>
</template>

<script>
// import DashboardPanel from '@/components/app/dashboard/DashboardPanel'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'

export default {
  name: 'CourseProgressOverlay',

  components: {
    // DashboardPanel,
    PerfectScrollbar
  },

  data: () => {
    return {
      show: false,
      lessons: [],
      settings: {
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: false
      }
    }
  },

  mounted () {
    this.$nuxt.$on('show-curriculum-progress', (lessons) => {
      this.lessons = lessons
      this.show = true
      document.querySelector('html').style.overflowY = 'hidden'
    })
  },

  methods: {
    close () {
      this.show = false
      document.querySelector('html').style.overflowY = 'auto'
    }
  }
}
</script>

<style lang="scss" scoped>
.top-left {
  position: fixed;
  top: 6px !important;
  left: 6px !important;
  z-index: 400;
}
</style>

<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"></style>

<style lang="scss" scoped>
.panel-container {
  overflow-x: visible;
}

.ps {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh - 32px);
  max-height: calc(100vh - 32px);
  padding-top: 64px;
  padding-bottom: 64px;
  overflow: auto;
  z-index: 300;
}
</style>
