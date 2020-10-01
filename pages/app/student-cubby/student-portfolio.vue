<template>
  <v-card flat>
    <v-card-text>
      <div class="text-center">
        <underlined-title class="text-h6 text-md-h3" text="Student Portfolio" />

        <p class="mt-2">
          Keep track of your worksheets and progress!
        </p>
      </div>
    </v-card-text>

    <template
      v-if="!loading && (!uploadedWorksheets || !uploadedWorksheets.length)"
    >
      <v-row justify="center">
        <v-col cols="8">
          <v-row align="center" justify="center">
            <v-col cols="4">
              <v-img
                :src="
                  require('@/assets/png/student-cubby/portfolio/placeholder1.png')
                "
                contain
              />
            </v-col>

            <v-col cols="4">
              <v-img
                :src="
                  require('@/assets/png/student-cubby/portfolio/placeholder2.png')
                "
                contain
              />
            </v-col>

            <v-col cols="4">
              <v-img
                :src="
                  require('@/assets/png/student-cubby/portfolio/placeholder3.png')
                "
                contain
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="8">
          <p class="portfolio-no-uploads">
            You have no worksheets uploaded yet
          </p>
        </v-col>

        <v-col cols="8">
          <p class="text-justify">
            Take a photo of the completed worksheets and upload them here to
            keep track of progress in tracing, math, science, language and
            cognitive activities.
          </p>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <portfolio-carousel
        v-for="category in categories"
        :key="`portfolio-category-${category.id}`"
        v-bind="{ category }"
      />

      <portfolio-overlay />
    </template>
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
      uploadedWorksheets: [],
      loading: true
    }
  },

  computed: {
    studentId () {
      return this.$route.query.id
    },

    categories () {
      return this.uploadedWorksheets
        ? this.uploadedWorksheets.filter(
          ({ worksheetUploads }) => worksheetUploads.length
        )
        : []
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
      try {
        this.uploadedWorksheets = await this.getUploaded(this.studentId)
      } catch (error) {
        this.$snotify.error('Sorry! There was an error loading your progress.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
.portfolio {
  &-subtitle {
    font-size: 20px;
  }
  &-no-uploads {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
  }
  &-text {
    font-size: 20px;
    text-align: center;
  }
}
</style>
