<template>
  <pg-dialog :value="overlay" fullscreen>
    <v-card class="dialog-portfolio-overlay">
      <v-container class="vh-container pa-0" fluid>
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

        <v-row class="vh-row" align="center" justify="center" no-gutters>
          <v-col class="px-3 px-lg-0" sm="12" lg="8" xl="10">
            <v-row justify="end">
              <v-btn color="white" icon @click.stop="overlay = false">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-row>
            <portfolio-card
              v-if="overlay"
              :child="currtentChild"
              v-bind="{ entityId, entityType, image, noShare, infoUser, created }"
              display-mode
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </pg-dialog>
</template>

<script>
import PortfolioCard from './PortfolioCard.vue'

export default {
  name: 'PortfolioOverlay',

  components: {
    PortfolioCard
  },

  props: {
    child: {
      type: Object,
      default: () => {}
    },
    noShare: {
      type: Boolean,
      default: false,
      required: false
    },
    infoUser: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data: () => {
    return {
      entityId: null,
      entityType: null,
      image: null,
      currtentChild: null,
      overlay: false,
      created: null
    }
  },

  created () {
    this.currtentChild = this.child
    this.$nuxt.$on(
      'open-portfolio-overlay',
      ({ child, entityId, entityType, image, created }) => {
        this.currtentChild = child
        this.entityId = entityId
        this.entityType = entityType
        this.image = image
        this.overlay = true
        this.created = created
      }
    )
  },

  beforeDestroy () {
    this.$nuxt.$off('open-portfolio-overlay')
  }
}
</script>

<style lang="scss" scoped>
.vh-container {
  min-height: 100vh;
}

.vh-row {
  min-height: 90vh;
}

.fullscreen {
  width: 100% !important;
  height: 100% !important;
}

.dialog-portfolio-overlay {
  background-color: rgba(0, 0, 0, 0.68) !important;
}
</style>
