<template>
  <v-overlay :dark="false" :value="value" z-index="4000">
    <v-card class="patch-earned-card" max-width="1124px">
      <div class="green-line-bigger green-line-1" />
      <div class="green-line-bigger green-line-2" />
      <v-card-text class="patch-earned-content">
        <v-row align="center" justify="center">
          <v-col cols="10" sm="4" md="4" lg="5">
            <v-img
              class="mx-auto"
              :src="icon || require('@/assets/png/dashboard/badge.png')"
              :max-width="$vuetify.breakpoint.xsOnly ? '196px' : '352px'"
            />
          </v-col>
          <v-col cols="12" md="7" lg="6">
            <div class="patch-earned-title-container">
              <underlined-title
                no-autoresize-font
                :font-size="$vuetify.breakpoint.xsOnly ? '30px' : '56px'"
                font-weight="bold"
                class="patch-earned-title"
                text="Congratulations!"
              />
            </div>
            <p class="patch-earned-paragraph-1">
              {{ $t('videoLibrary.patchEarned.watch1') + ' ' + number }}
              <span class="text-lowercase">
                {{ category }}
              </span>
              {{ $t('videoLibrary.patchEarned.watch2') }}
            </p>
            <p class="patch-earned-paragraph-2">
              {{ $t('videoLibrary.patchEarned.keepWatching') }}
            </p>
          </v-col>
          <v-col cols="12">
            <v-row justify="center">
              <v-col cols="12">
                <p class="patch-earned-next-text">
                  {{ $t('videoLibrary.patchEarned.nextText') }}
                </p>
              </v-col>
              <v-col cols="12">
                <v-row justify="center" no-gutters>
                  <v-col cols="11" md="8" lg="7">
                    <v-btn
                      class="patch-earned-button"
                      color="accent"
                      block
                      @click.stop="nextVideo"
                    >
                      <img
                        class="patch-earned-play-btn-icon"
                        height="30px;"
                        src="@/assets/svg/play-button.svg"
                      >
                      <template v-if="$vuetify.breakpoint.xsOnly">
                        {{ $t('videoLibrary.patchEarned.nextVideo') }}
                      </template>
                      <template v-else>
                        {{ $t('videoLibrary.patchEarned.goNextVideo') }}
                      </template>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row justify="center" no-gutters>
                  <v-col cols="11" md="8" lg="7">
                    <v-btn
                      class="patch-earned-button"
                      color="#FEC572"
                      block
                      nuxt
                      :to="{ name: 'app-student-cubby-patches' }"
                    >
                      {{ $t('videoLibrary.patchEarned.goPatches') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-btn
              class="patch-earned-return-btn mb-3"
              color="primary"
              text
              block
              @click.stop="returnTo"
            >
              {{ returnText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  name: 'PatchEarnedDialog',

  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },

    player: {
      validator: (val) => {
        return typeof val === 'object' || val === null
      },
      required: true
    },

    icon: {
      validator: (val) => {
        return typeof val === 'string' || val === null
      },
      required: true
    },

    number: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      required: true
    }
  },

  data: () => {
    return {}
  },

  computed: {
    returnText() {
      if (this.$route.name === 'app-library') {
        return this.$t('videoLibrary.patchEarned.returnText1')
      }
      return this.$t('videoLibrary.patchEarned.returnText2')
    }
  },

  methods: {
    nextVideo() {
      this.player.nextVideo()
      this.close()
    },

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
.patch-earned {
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
  &-paragraph-1 {
    font-size: 24px;
    line-height: 1.52;
    font-weight: 600;
    text-align: center;
  }
  &-paragraph-2 {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.38;
    text-align: center;
    margin-bottom: 0px !important;
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
    @media screen and (max-width: 599px) {
      font-size: 18px;
    }
  }
}
</style>
