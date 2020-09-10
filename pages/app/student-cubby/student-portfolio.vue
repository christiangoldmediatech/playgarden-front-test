<template>
  <v-card flat>
    <v-card-text>
      <div class="text-center">
        <underlined-title class="text-h3" text="Student Portfolio" />
        <p class="mt-5">
          Keep track of your worksheets and progress!
        </p>
      </div>
    </v-card-text>

    <portfolio-carousel
      v-for="category in categories"
      :key="`portfolio-category-${category.id}`"
      v-bind="{ category }"
    />
    <portfolio-overlay />
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import PortfolioCarousel from '@/components/app/student-cubby/PortfolioCarousel.vue'
import PortfolioOverlay from '@/components/app/student-cubby/PortfolioOverlay.vue'

export default {
  name: 'StudentPortfolio',

  components: {
    PortfolioCarousel,
    PortfolioOverlay
  },

  data: () => {
    return {
      uploadedWorksheets: []
    }
  },

  computed: {
    studentId () {
      return this.$route.query.id
    },

    categories () {
      return this.uploadedWorksheets.filter(({ worksheetUploads }) => worksheetUploads.length)
    }
  },

  watch: {
    studentId (id) {
      if (id) {
        this.refresh()
      }
    }
  },

  created () {
    this.refresh()
  },

  methods: {
    ...mapActions('offline-worksheet', { getUploaded: 'getUploaded' }),

    async refresh () {
      this.uploadedWorksheets = await this.getUploaded(this.studentId)
    }
  }
}
</script>
