<template>
  <pg-video-dialog persistent :value="value" max-width="1124px" max-height="100%">
    <v-card class="patch-earned-comp-card">
      <div class="patch-earned-comp-green-line-1 green-line-bigger green-line-1" />
      <div class="patch-earned-comp-green-line-2 green-line-bigger green-line-2" />
      <v-card-text class="patch-earned-comp-content">
        <v-row align="center" justify="center">
          <v-col cols="10" sm="4" md="4" lg="5">
            <v-img
              class="mx-auto"
              :src="icon || require('@/assets/png/dashboard/badge.png')"
              :max-width="$vuetify.breakpoint.xsOnly ? '196px' : '352px'"
            />
          </v-col>
          <v-col cols="12" md="7" lg="6">
            <div class="patch-earned-comp-title-container">
              <underlined-title
                no-autoresize-font
                :font-size="$vuetify.breakpoint.xsOnly ? '30px' : '56px'"
                font-weight="bold"
                class="patch-earned-comp-title"
                text="Congratulations!"
              />
            </div>
            <p class="patch-earned-comp-paragraph-1">
              You have watched {{ number }}
              <span class="text-lowercase">
                {{ category }}
              </span>
              Activities and earned a NEW patch!
            </p>
            <p class="patch-earned-comp-paragraph-2">
              Keep watching videos to master the category and earn more patches.
            </p>
          </v-col>
          <v-col cols="12">
            <v-row justify="center">
              <v-col cols="12">
                <p class="patch-earned-comp-next-text">
                  What do you want to do next?
                </p>
              </v-col>
              <v-col cols="12">
                <v-row justify="center" no-gutters>
                  <v-col cols="11" md="8" lg="7">
                    <v-btn
                      class="patch-earned-comp-button"
                      color="accent"
                      block
                      @click.stop="nextVideo"
                    >
                      <img
                        class="patch-earned-comp-play-btn-icon"
                        height="30px;"
                        src="@/assets/svg/play-button.svg"
                      >
                      <template v-if="$vuetify.breakpoint.xsOnly">
                        Next video
                      </template>
                      <template v-else>
                        Go to next video
                      </template>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row justify="center" no-gutters>
                  <v-col cols="11" md="8" lg="7">
                    <v-btn
                      class="patch-earned-comp-button"
                      color="#FEC572"
                      block
                      nuxt
                      :to="{ name: 'app-student-cubby-patches' }"
                    >
                      Go to Patches
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-btn
              class="patch-earned-comp-return-btn mb-3"
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
  </pg-video-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'PatchEarnedDialogCompositionApi',

  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },

    icon: {
      type: String,
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

  setup(_, { emit }) {
    const route = useRoute()
    const returnText = computed(() => {
      if (route.value.name?.includes('app-library')) {
        return 'Return to Library'
      }
      return 'Return to Lesson'
    })

    function close(): void {
      emit('input', false)
    }

    function nextVideo(): void {
      emit('next-video')
      close()
    }

    function returnTo(): void {
      emit('return')
      close()
    }

    return {
      returnText,
      close,
      nextVideo,
      returnTo
    }
  }
})
</script>

<style lang="scss" scoped>
.patch-earned-comp {
  &-card.v-sheet.v-card {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
  }

  &-green-line-1 {
    position: absolute;
    top: 0;
  }

  &-green-line-2 {
    position: absolute;
    top: 30px;
  }

  &-content.v-card__text {
    margin-top: 60px;
    padding: 0px;
    padding-top: 16px !important;
    padding-bottom: 8px !important;
    box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.12);
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
