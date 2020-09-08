<template>
  <v-overlay class="justify-start" :dark="false" :value="show">
    <v-btn
      class="top-left text-none white--text px-4"
      text
      x-large
      @click.stop="close"
    >
      <v-icon left small>
        mdi-less-than
      </v-icon>
      Back
    </v-btn>
    <v-container class="panel-row fullscreen-overlay">
      <v-row class="flex-nowrap panel-row">
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
      </v-row>
    </v-container>
  </v-overlay>
</template>

<script>
import DashboardPanel from '@/components/app/dashboard/DashboardPanel'

export default {
  name: 'CourseProgressOverlay',

  components: {
    DashboardPanel
  },

  data: () => {
    return {
      show: false,
      lessons: []
    }
  },

  mounted () {
    this.$nuxt.$on('show-curriculum-progress', (lessons) => {
      this.lessons = lessons
      this.show = true
    })
  },

  methods: {
    close () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.top-left {
  position: absolute;
  top: -24px !important;
  left: 6px !important;
}

.panel-row {
  max-height: 100%;
  overflow-x: auto;
}
</style>
