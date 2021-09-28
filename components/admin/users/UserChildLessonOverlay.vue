<template>
  <v-overlay v-model="dialog" content-class="elevation-0" z-index="10000" :dark="false">
    <v-container>
      <v-row justify="center">
        <v-card width="70vh" max-width="90%" elevation="0" color="transparent">
          <v-row justify="end">
            <v-btn
              class="timeline-close-btn"
              color="white"
              icon
              @click.stop="dialog = false"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-row>
        </v-card>
      </v-row>

      <v-row justify="center">
        <v-card width="70vh" height="90vh" max-width="90%" color="transparent">
          <v-row justify="center" align-content="center">
            <v-progress-circular
              v-if="loading"
              color="accent"
              indeterminate
              size="128"
              width="8"
            />

            <v-row v-else justify="center" class="cl-overlay" no-gutters>
              <dashboard-panel
                no-link-mode
                display-mode
                v-bind="{ lesson }"
                z-index="10"
              />
            </v-row>
          </v-row>
        </v-card>
      </v-row>
    </v-container>
  </v-overlay>
</template>

<script>
import { mapActions } from 'vuex'
import DashboardPanel from '@/components/app/dashboard/DashboardPanel.vue'

export default {
  name: 'UserChildLessonOverlay',

  components: {
    DashboardPanel
  },

  data: () => {
    return {
      dialog: false,
      loading: false,
      lesson: null
    }
  },

  created () {
    this.$nuxt.$on('open-lesson-overlay', ({ childId, lessonId }) => {
      this.lesson = null
      this.loading = true
      this.getCurrentLessonByChildrenId({ lessonId, childId }).then(({ lesson }) => {
        this.lesson = lesson
        this.loading = false
      })
      this.dialog = true
    })
  },

  methods: {
    ...mapActions('children/lesson', ['getCurrentLessonByChildrenId'])
  }
}
</script>

<style lang="scss">
.cl-overlay {
  height: 90vh;
  max-height: 90vh;
  position: relative;
  &-close-btn {
    position: absolute;
    right: -36px;
    top: 55px;
  }
}
</style>
