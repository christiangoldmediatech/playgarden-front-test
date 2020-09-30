<template>
  <v-overlay :dark="false" :value="value" z-index="700">
    <v-card class="piece-earned-card" max-width="1124px">
      <div class="green-line-bigger green-line-1" />
      <div class="green-line-bigger green-line-2" />
      <v-card-text class="piece-earned-content">
        <v-row align="center" justify="center">
          <v-col cols="10" lg="4">
            <v-img
              class="mx-auto"
              :src="require('@/assets/png/dashboard/piece.png')"
              max-width="348px"
            />
          </v-col>
          <v-col cols="12" lg="8">
            <div class="piece-earned-title-container">
              <underlined-title
                no-autoresize-font
                :font-size="$vuetify.breakpoint.xs ? '36px' : '56px'"
                font-weight="bold"
                class="piece-earned-title"
                text="Congratulations!"
              />
            </div>
            <p class="piece-earned-paragraph-1">
              You have completed all lessons for Letter {{ letter }}, you won a puzzle piece!
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
                      :to="$router.push({ name: 'app-dashboard-lesson-activities' })"
                    >
                      <img class="piece-earned-play-btn-icon" height="30px;" src="@/assets/svg/play-button.svg">
                      Go to activites
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
  &-card.v-sheet.v-card {
    margin: 0 16px;
    max-width: 100vw;
    max-height: 90vh;
    overflow: hidden;
    border-radius: 4px;
  }
  &-content.v-card__text {
    max-height: calc(90vh - 60px);
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
    font-size: 33px;
    line-height: 1.52;
    font-weight: 600;
    text-align: center;
  }
  &-next-text {
    font-size: 33px;
    font-weight: 600;
    line-height: 1.52;
    text-align: center;
    margin-bottom: 0 !important;
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
  }
}
</style>
