<template>
  <v-row>
    <v-col cols="12">
      <span class="text-uppercase font-weight-bold text-h6">
        {{ category.category }}
      </span>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col
          v-for="i in 4"
          :key="`category-${category.id}-card-${i}`"
          cols="12"
          sm="6"
          lg="3"
        >
          <portfolio-card
            :image="require(`@/assets/png/student-cubby/portfolio/placeholder-${i}.png`)"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="6">
      <v-btn
        text
        :disabled="page === 1"
        @click.stop="moveCarousel(-1)"
      >
        <v-img
          :src="require('@/assets/png/player/left-arrow.svg')"
          max-width="32px"
        />
      </v-btn>
    </v-col>
    <v-col class="text-right" cols="6">
      <v-btn
        text
        :disabled="(page * limit) >= total"
        @click.stop="moveCarousel(1)"
      >
        <v-img
          :src="require('@/assets/png/player/right-arrow.svg')"
          max-width="32px"
        />
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import PortfolioCard from './PortfolioCard.vue'

export default {
  name: 'PortfolioCarousel',

  components: {
    PortfolioCard
  },

  props: {
    category: {
      type: Object,
      required: true
    }
  },

  data: () => {
    return {
      page: 1
    }
  },

  computed: {
    limit () {
      if (this.$vuetify.breakpoint.sm) { return 2 }
      if (this.$vuetify.breakpoint.xs) { return 1 }
      return 4
    },

    total () {
      return this.category.items ? this.category.items.length : 0
    },

    start () {
      return (this.page - 1) * this.limit
    },

    end () {
      return ((this.start + this.limit) < this.total) ? this.start + this.limit : this.total
    },

    list () {
      if (this.total > 0) {
        return this.category.items.slice(this.start, this.end)
      }
      return []
    }
  },

  methods: {
    moveCarousel (direction) {
      this.page += direction
    }
  }
}
</script>
