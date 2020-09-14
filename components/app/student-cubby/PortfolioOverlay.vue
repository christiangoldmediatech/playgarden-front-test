<template>
  <v-overlay :value="overlay" dark z-index="100">
    <v-container class="pa-0 fullscreen" fluid>
      <v-row class="fill-height" align="center" justify="center">
        <v-col
          class="position-relative"
          cols="7"
          sm="6"
          md="5"
          lg="4"
          xl="3"
        >
          <v-btn
            class="top-right"
            icon
            @click.stop="overlay = false"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
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
.position-relative {
  position: relative;
}

.top-right {
  position: absolute;
  top: 0;
  right: -36px;
  z-index: 1;
}

.fullscreen {
  width: 100vw !important;
  height: 100vh !important;
}
</style>
