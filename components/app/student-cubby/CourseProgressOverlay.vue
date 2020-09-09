<template>
  <v-overlay
    :class="`${loading ? 'align-center justify-center' : 'align-start justify-start'}`"
    :dark="false"
    :value="show"
  >
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
    <v-progress-circular
      v-if="loading"
      color="#f89838"
      indeterminate
      size="128"
      width="8"
    />
    <perfect-scrollbar v-else>
      <v-container class="panel-container" fill-height fluid>
        <v-row class="flex-nowrap">
          <v-col
            v-for="lesson in lessons"
            :key="`curriculum-lesson-progress-${lesson.id}`"
            cols="10"
            sm="8"
            md="4"
            lg="3"
          >
            <dashboard-panel
              v-bind="{ lesson, customOverrides: { lessonId: lesson.id, childId: studentId } }"
              display-mode
            />
          </v-col>
          <v-col
            v-for="i in missing"
            :key="`curriculum-lesson-missing-${i}`"
            cols="10"
            sm="8"
            md="4"
            lg="3"
          >
            <blank-dashboard-panel
              :letter="(lessons[0]) ? lessons[0].curriculumType.letter : ''"
              :day="i + lessons.length"
            />
          </v-col>
        </v-row>
      </v-container>
    </perfect-scrollbar>
  </v-overlay>
</template>

<script>
import DashboardPanel from '@/components/app/dashboard/DashboardPanel.vue'
import BlankDashboardPanel from '@/components/app/dashboard/BlankDashboardPanel.vue'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import { mapActions } from 'vuex'

export default {
  name: 'CourseProgressOverlay',

  components: {
    DashboardPanel,
    BlankDashboardPanel,
    PerfectScrollbar
  },

  data: () => {
    return {
      show: false,
      loading: false,
      lessons: []
    }
  },

  computed: {
    studentId () {
      return this.$route.query.id
    },

    missing () {
      return 5 - this.lessons.length
    }
  },

  mounted () {
    this.$nuxt.$on('show-curriculum-progress', (curriculumTypeId) => {
      this.lessons = []
      this.loading = true
      this.getCourseProgressByChildId({ id: this.studentId, curriculumTypeId }).then((data) => {
        this.lessons = data.map(({ lesson }) => lesson)
        this.loading = false
      })
      this.show = true
      document.querySelector('html').style.overflowY = 'hidden'
    })
  },

  methods: {
    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),

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

.ps__rail-x:hover > .ps__thumb-x, .ps__rail-x:focus > .ps__thumb-x, .ps__rail-x.ps--clicking .ps__thumb-x {
  background-color: #C2DAA5 !important;
}
</style>
