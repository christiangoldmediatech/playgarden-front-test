<template>
  <v-dialog :value="overlay" :fullscreen="fullscreen">
    <v-card class="dialog-portfolio-overlay">
      <v-btn
        class="top-left text-none white--text px-4"
        text
        x-large
        @click.stop="overlay = false"
      >
        <v-icon left>
          mdi-less-than
        </v-icon>
        Back
      </v-btn>
      <v-row class="fill-height" align="center" justify="center">
        <v-col
          class="position-relative"
          cols="12"
          sm="6"
          md="5"
          lg="8"
          xl="10"
        >
          <v-btn
            class="top-right color-close"
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
    </v-card>
  </v-dialog>
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
      overlay: false,
      fullscreen: true
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
  width: 100% !important;
  height: 100% !important;
}

.color-close {
  color: white !important;
}

.dialog-portfolio-overlay {
  background-color: rgba(0, 0, 0, 0.68) !important;
}
</style>
