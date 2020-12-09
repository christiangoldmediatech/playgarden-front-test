<template>
  <v-overlay :dark="false" :value="value" z-index="800">
    <v-card class="piece-earned-card" max-width="1124px">
      <div class="green-line-bigger green-line-1" />
      <div class="green-line-bigger green-line-2" />
      <v-card-text class="piece-earned-content">
        <v-row :class="{ 'mx-0': $vuetify.breakpoint.xsOnly }" align="center" justify="center">
          <v-col class="d-flex justify-center" cols="10" sm="4" md="4" lg="3">
            <img
              class="piece-earned-img"
              :src="puzzleImg || require('@/assets/png/dashboard/piece.png')"
            >
          </v-col>
          <v-col cols="12" sm="8" md="7" lg="6">
            <div class="piece-earned-title-container">
              <underlined-title
                no-autoresize-font
                :font-size="$vuetify.breakpoint.xs ? '30px' : '46px'"
                font-weight="bold"
                class="piece-earned-title"
                text="Congratulations!"
              />
            </div>
            <p class="piece-earned-paragraph">
              You have completed the Letter {{ letter }} lesson! You earned a piece of your Letter {{ letter }} puzzle!
            </p>
          </v-col>
          <v-col cols="12">
            <v-row justify="center">
              <v-col cols="12">
                <p class="piece-earned-next-text">
                  What do you want to do next?
                </p>
              </v-col>
              <v-col cols="12">
                <v-row justify="center" no-gutters>
                  <v-col cols="11" md="8" lg="7">
                    <v-btn
                      class="piece-earned-button"
                      color="#FEC572"
                      block
                      nuxt
                      :to="{ name: 'app-student-cubby-puzzle' }"
                    >
                      Go to puzzle
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row justify="center" no-gutters>
                  <v-col cols="11" md="8" lg="7">
                    <v-btn
                      class="piece-earned-button"
                      color="accent"
                      block
                      nuxt
                      :to="{ name: 'app-activities' }"
                    >
                      <img class="piece-earned-play-btn-icon" height="30px;" src="@/assets/svg/play-button.svg">
                      <template v-if="$vuetify.breakpoint.xsOnly">
                        Activities
                      </template>
                      <template v-else>
                        Go to activites
                      </template>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-btn
              class="piece-earned-return-btn mb-3"
              color="primary"
              text
              block
              @click.stop="returnTo"
            >
              Return to Dashboard
            </v-btn>
          </v-col>
        </v-row>
        <svg width="0" height="0">
          <defs>
            <clipPath id="myClip" transform="scale(0.002427184466019, 0.002457002457002)" clipPathUnits="objectBoundingBox">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M77.7326 319.782C83.2926 319.782 88.3726 320.392 93.3426 319.672C111.813 316.992 130.203 313.172 148.713 311.292C155.713 310.582 163.033 313.422 170.013 315.642C178.673 318.402 187.543 321.042 195.553 325.882C202.833 330.282 206.623 339.072 203.363 350.152C200.593 359.552 198.063 369.292 194.083 377.812C189.903 386.762 193.233 391.742 198.383 394.762C204.543 398.362 211.543 399.402 217.933 402.442C236.933 411.442 253.993 401.942 271.013 393.382C276.313 390.712 278.073 383.632 275.393 376.312C273.823 372.177 271.944 368.166 269.773 364.312C260.273 346.992 264.693 332.312 277.443 325.732C288.083 320.252 300.003 319.182 310.993 314.652C336.173 304.272 360.513 312.902 384.843 319.482C394.533 322.102 400.503 318.812 402.723 306.042C404.513 295.802 407.723 285.912 408.983 275.592C411.823 252.592 413.263 229.412 403.443 208.132C396.393 192.872 390.123 190.492 377.883 197.592C374.883 199.342 371.883 201.302 368.883 202.772C347.533 212.942 332.373 205.972 324.183 175.292C320.233 160.492 320.943 147.292 324.333 132.892C327.653 118.772 343.723 105.892 354.523 110.502C363.903 114.502 373.293 118.502 382.703 122.342C392.113 126.182 401.173 122.412 404.423 110.442C407.673 98.4723 410.713 84.9222 409.653 72.6922C408.083 54.6922 402.993 37.2122 398.893 19.6922C398.133 16.4522 395.213 12.4922 392.783 11.7722C379.953 7.97224 367.043 3.34224 353.993 2.30224C333.223 0.652243 312.093 -0.897755 291.843 7.49225C285.053 10.3122 277.203 14.9822 273.373 22.0622C269.043 30.0622 275.373 38.0122 280.203 44.2422C280.798 45.1871 281.291 46.1928 281.673 47.2422C289.473 63.9322 293.673 70.3522 275.133 80.7222C263.993 86.9622 251.683 89.7223 239.813 93.6323C223.183 99.0523 207.683 94.4222 193.593 82.4822C184.693 74.9222 182.753 60.8222 187.823 48.6522C190.693 41.7722 193.403 34.7722 196.383 27.9722C198.963 22.0922 198.473 18.2522 192.863 16.9122C185.233 15.0822 177.663 12.5022 169.973 11.4122C145.433 7.93223 120.843 4.99223 96.2726 1.85223C90.3226 1.08223 88.2726 4.85224 88.3326 12.3622C88.5226 35.3622 88.8126 58.3622 88.1926 81.3122C87.8183 92.9033 86.4803 104.443 84.1926 115.812C81.1926 131.242 70.7226 138.812 58.8326 134.432C49.2453 130.759 39.9289 126.415 30.9526 121.432C21.3026 116.232 12.4926 119.172 6.54259 130.352C-0.967408 144.472 0.262574 161.262 3.74257 174.722C8.77257 194.462 15.4226 199.932 29.2526 197.232C34.0526 196.232 38.5026 192.232 43.1226 189.722C53.9726 183.722 65.3426 175.942 75.8126 188.992C89.0426 205.492 93.3926 227.852 91.1326 250.212C88.7826 273.482 82.5126 296.082 77.7826 319.832L77.7326 319.782Z" stroke="#010101" stroke-miterlimit="10" />
            </clipPath>
          </defs>
        </svg>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  name: 'PuzzlePieceEarnedDialog',

  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },

    letter: {
      type: String,
      required: false,
      default: ''
    },

    puzzleImg: {
      validator: (val) => {
        return typeof val === 'string' || val === null
      },
      required: false,
      default: null
    }
  },

  data: () => {
    return {}
  },

  methods: {
    returnTo () {
      this.$emit('return')
      this.close()
    },

    close () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss">
.piece-earned {
  &-img {
    width: 196px;
    height: 196px;
    max-width: 196px;
    max-height: 196px;
    object-fit: cover;
    object-position: center;
    clip-path: url(#myClip);
  }
  &-card.v-sheet.v-card {
    margin: 0 16px;
    max-width: 100vw;
    max-height: 95vh;
    overflow: hidden;
    border-radius: 4px;
  }
  &-content.v-card__text {
    max-height: calc(95vh - 60px);
    max-width: 95vw;
    overflow-x: hidden;
    overflow-y: auto;
    box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.12);
    padding: 0px;
  }
  &-title {
    line-height: 1.3 !important;
    &-container {
      text-align: center;
    }
  }
  &-paragraph {
    font-size: 26px;
    line-height: 1.52;
    font-weight: 600;
    text-align: center;
    @media screen and (max-width: 599px) {
      font-size: 20px;
    }
  }
  &-next-text {
    font-size: 33px;
    font-weight: 600;
    line-height: 1.52;
    text-align: center;
    margin-bottom: 0 !important;
    @media screen and (max-width: 599px) {
      font-size: 24px;
    }
  }
  &-button.v-btn {
    height: 59px !important;
    font-size: 24px;
    line-height: 1.46;
    letter-spacing: 0.04em;
    color: white !important;
  }
  &-play-btn-icon {
    position: relative;
    left: -16px;
  }
  &-return-btn.v-btn {
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 0.04em;
    line-height: 1.46;
    @media screen and (max-width: 599px) {
      font-size: 18px;
    }
  }
}
</style>
