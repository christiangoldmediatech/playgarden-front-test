<template>
  <v-container class="background-no-found" fluid :class="containerClasses">
    <v-row align="center" justify="center" no-gutters>
      <v-col
        cols="12"
        md="5"
        order="2"
        order-md="1"
        class="text-center text-md-left"
      >
        <div class="text-center">
          <img :src="errorCode === 404 ? require('@/assets/png/no-content-found.png') : require('@/assets/png/unknown-error.png')" :height="isMobile ? '100px' : '130px'">
        </div>
        <div class="error-text">
          This URL appears to be broken. Please reach out to <a class="mailInfo" href="mailto:hello@playgardenprep.com&subject=Hello">hello@playgardenprep.com</a> to let us know!
          <br />
          <v-btn
            class="mt-8"
            color="primary"
            large
            router
            :to="{ name: 'app-virtual-preschool' }"
          >
            Go Back To Home
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="7" class="d-flex justify-left" order="1" order-md="2">
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
    errorCode: {
      type: Number,
      default: 404
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

.background-no-found {
  background-image:
    url("~@/assets/png/background-no-found.png");
  background-size: 122% 157%;
  background-position: top 60% right 184%;

  @media screen and (min-width: $breakpoint-xs) {
    background-size: 90% 212%;
    background-position: top 60% right -240%;
  }
}

.error-text {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 40px;
  text-align: center;
  color: #707070;

  @media screen and (min-width: $breakpoint-xs) {
    font-size: 32px;
  }
}

.fill-height {
  // height: 100vh !important;
}

.mailInfo {
  color: #68C453 !important;
  text-decoration: underline !important;
  display: inline-block;
}
.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
