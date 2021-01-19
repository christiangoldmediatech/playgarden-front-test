<template>
  <v-overlay
    v-model="dialog"
    z-index="20"
    :dark="false"
  >
    <v-progress-circular
      v-if="loading"
      color="accent"
      indeterminate
      size="128"
      width="8"
    />
    <div v-else class="cl-overlay">
      <v-btn
        class="cl-overlay-close-btn"
        color="white"
        icon
        @click.stop="dialog = false"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
      <dashboard-panel no-link-mode display-mode v-bind="{ lesson }" />
    </div>
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
      this.getCurrentLessonByChildrenId({ lessonId, childId }).then((data) => {
        this.lesson = data
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
