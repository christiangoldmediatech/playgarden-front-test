<template>
  <div class="">
    <v-row>
      <v-col cols="2" class="ml-4">
        <v-progress-circular
          :rotate="360"
          :size="($vuetify.breakpoint.mobile) ? 50 : 70"
          :width="5"
          :value="item.percentage"
          color="orange lighten-1"
        >
          <span class="stats">{{ `${item.done}/${item.total}` }}</span>
        </v-progress-circular>
      </v-col>
      <v-col class="ml-2 mt-6">
        <p class="text-stats">
          <span class="font-weight-bold text-stats">
            {{ item.title }}
          </span>
        </p>

        <v-btn
          v-if="canLaunchCourseProgess"
          color="primary"
          small
          @click="launchCourseProgessOverlay"
        >
          View Lesson Progress
        </v-btn>

        <v-btn
          v-if="canRedirectToPortfolio"
          color="primary"
          small
          @click="goToPortfolio"
        >
          View Worksheets
        </v-btn>
      </v-col>
    </v-row>
    <v-divider v-if="!getShowDivider" class="mx-8 my-3" />
  </div>
</template>

<script>
export default {
  name: 'ItemProgress',

  props: {
    item: {
      type: Object,
      required: true,
      default: () => {}
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    index: {
      type: Number,
      required: true,
      default: 0
    },
    curriculumTypeId: {
      type: Number,
      default: 0
    }
  },

  data: () => ({}),

  computed: {
    isAdmin () {
      return this.$route.name.includes('admin')
    },

    canLaunchCourseProgess () {
      return this.isAdmin && this.item.title === 'Daily Lessons Attended'
    },

    canRedirectToPortfolio () {
      return this.isAdmin && this.item.title === 'Worksheets Uploaded'
    },

    getShowDivider () {
      return (this.index === (this.total - 1))
    }
  },

  watch: {},

  created () {},

  methods: {
    launchCourseProgessOverlay () {
      this.$nuxt.$emit('show-curriculum-progress', this.curriculumTypeId)
    },

    goToPortfolio () {
      const routeData = this.$router.resolve({
        name: 'admin-portfolio',
        query: {
          id: this.$route.query.id
        }
      })

      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.stats {
  color: var(--v-black-base) !important;
}

.text-stats {
  color: var(--v-black-base) !important;
}
</style>
