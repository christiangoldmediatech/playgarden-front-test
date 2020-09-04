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
      categoryRows: [],
      uploadedWorksheets: []
    }
  },

  computed: {
    id () {
      return this.$route.query.id
    },

    categories () {
      return this.categoryRows
    }
  },

  watch: {
    id (id) {
      if (id) {
        this.refresh()
      }
    }
  },

  created () {
    this.loadCategories()
  },

  methods: {
    ...mapActions('offline-worksheet-categories', [
      'getOfflineWorksheetCategories',
      'getChildWorksheets'
    ]),

    async loadCategories () {
      this.categoryRows = await this.getOfflineWorksheetCategories()
    },

    async refresh () {
      this.uploadedWorksheets = await this.getChildWorksheets(this.id)
    }
  }
}
</script>
