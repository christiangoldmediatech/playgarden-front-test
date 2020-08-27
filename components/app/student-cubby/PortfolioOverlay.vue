<template>
  <v-overlay :value="overlay" dark z-index="100">
    <v-container class="pa-0 fullscreen" fluid>
      <v-row>
        <v-col cols="ml-3 mt-3">
          <v-btn
            class="text-none"
            text
            x-large
            @click.stop="overlay = false"
          >
            <v-icon class="mr-2" small left>
              mdi-less-than
            </v-icon>
            Back
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="fill-height" align="center" justify="center">
        <v-col cols="3">
          <portfolio-card v-bind="{ image }" display-mode />
        </v-col>
      </v-row>
    </v-container>
  </v-overlay>
</template>

<script>
import PortfolioCard from './PortfolioCard.vue'

export default {
  name: 'PortfolioOverlay',

  components: {
    PortfolioCard
  },

  data: () => {
    return {
      image: null,
      overlay: false
    }
  },

  created () {
    this.$nuxt.$on('open-portfolio-overlay', (image) => {
      this.image = image
      this.overlay = true
    })
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 100vw !important;
  height: 100vh !important;
}
</style>
