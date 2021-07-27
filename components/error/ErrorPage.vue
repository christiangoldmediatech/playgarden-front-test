<template>
  <v-container fluid :class="containerClasses">
    <v-row align="center" justify="center" no-gutters>
      <v-col
        cols="12"
        md="5"
        offset-md="1"
        :order="isMobile ? 2 : 1"
        class="text-center text-md-left"
      >
        <div>
          <img src="@/assets/png/error-window.png" height="50px" class="mb-2 pr-3">
          <img src="@/assets/svg/logo.svg" height="50px">
        </div>
        <div v-if="preText">
          <underlined-title
            :text="preText"
            font-size="48px"
            font-size-mobile="32px"
            letter-spacing="10px"
          />
        </div>
        <underlined-title
          :text="text"
          font-size="48px"
          font-size-mobile="32px"
          letter-spacing="10px"
        />
        <div class="text-h5 text-md-h4 font-weight-medium grey--text text--darken-2 my-4">
          {{ description }}
        </div>
        <v-btn
          class="my-3"
          color="warning"
          large
          router
          :to="{ name: 'app-virtual-preschool' }"
        >
          Go Back To Home
        </v-btn><br>
        <v-btn
          class="my-3"
          color="warning"
          large
          router
          outlined
          :to="{ name: 'app-dashboard' }"
        >
          Go Back To Lessons
        </v-btn>
        <v-btn
          class="my-3"
          color="warning"
          large
          outlined
          router
          :to="{ name: 'app-library' }"
        >
          Go To Library
        </v-btn>
      </v-col>
      <v-col cols="12" md="5" class="d-flex justify-left" :order="isMobile ? 1 : 2">
        <v-img
          :max-height="isMobile ? '400px' : '700px'"
          contain
          :src="img"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ErrorPage',

  props: {
    preText: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    }
  },

  computed: {
    ...mapState(['fullWidthPages']),

    fullWidth () {
      return this.fullWidthPages[this.$route.name]
    },

    containerClasses () {
      /**
       * Error pages use the 'default' layout by default, meaning that, for error pages thrown inside unknown routes,
       * they will not span full width, therefore, they will not need any margin to overflow the toolbar.
       */
      return {
        'fill-height': !this.isMobile,
        'mt-12': this.fullWidth,
        'my-md-0': true
      }
    },

    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  }
}
</script>

<style lang="scss" scoped>
.fill-height {
  height: 100vh !important;
}
.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
