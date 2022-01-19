<template>
  <v-overlay :dark="false" :value="value" z-index="4000">
    <v-card class="piece-earned-card" max-width="1124px">
      <div class="green-line-bigger green-line-1" />
      <div class="green-line-bigger green-line-2" />
      <v-card-text class="piece-earned-content">
        <v-row
          :class="{ 'mx-0': $vuetify.breakpoint.xsOnly }"
          align="center"
          justify="center"
        >
          <v-col class="d-flex justify-center" cols="10" sm="4" md="4" lg="3">
            <img
              class="piece-earned-img"
              :src="puzzleImg || require('@/assets/png/dashboard/piece.png')"
            />
            <puzzle-clip-path />
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
              You have completed the Letter {{ letter }} lesson! You earned a
              piece of your Letter {{ letter }} puzzle!
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
                      :to="{ name: 'app-library' }"
                    >
                      <img
                        class="piece-earned-play-btn-icon"
                        height="30px;"
                        src="@/assets/svg/play-button.svg"
                      />
                      <template v-if="$vuetify.breakpoint.xsOnly">
                        Library
                      </template>
                      <template v-else>
                        Go to Library
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
              Return to Lesson
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
import PuzzleClipPath from '@/components/PuzzleClipPath.vue'

export default {
  name: 'PuzzlePieceEarnedDialog',

  components: {
    PuzzleClipPath
  },

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
    returnTo() {
      this.$emit('return')
      this.close()
    },

    close() {
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
