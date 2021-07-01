<template>
  <v-row no-gutters>
    <v-card class="info-notification">
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="3">
            <v-img
              v-if="$vuetify.breakpoint.smAndUp"
              max-width="550"
              :src="require('@/assets/svg/children-play.svg')"
            />
          </v-col>
          <v-col cols="9">
            <v-row class="mx-4">
              <div>
                <underlined-title class="text-h6 text-md-h5" text="WE HOPE YOUR LITTLE ONE IS ENJOYING LEARNING WITH PLAYGARDEN PREP ONLINE!" />
                <p class="mt-4 text-justify">
                  Take advantage of the EARLY BIRD SPECIAL! Sign up now to receive:
                </p>

                <p class="mt-4 text-justify">
                  1- A Playgarden Prep backpack <br>
                  2- Specialized pencils <br>
                  3- The new workbook
                </p>

                <p class="mt-4 text-justify">
                  As always, you can cancel your enrollment anytime by going to your Accounts Page.
                  Please contact us with any questions about the plans, your enrollment, or anything at all!
                </p>
                <p class="mt-4 text-justify">
                  With kind regards,<br>
                  Playgarden Prep Teachers.
                </p>
                <v-row>
                  <v-col cols="2">
                    <v-btn
                      block
                      color="accent"
                      small
                      type="submit"
                    >
                      Subscribe Now
                    </v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      block
                      color="white"
                      small
                      type="submit"
                    >
                      Remind me Later
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <span class="grey--text">Need help? </span>
                    <span class="text-decoration-underline" @click="showContactUsModal">
                      <a class="accent--text">Contact us</a>
                    </span>
                  </v-col>
                </v-row>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'InfoWeekThree'
})
</script>

<style lang="scss">
.info-notification {
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
