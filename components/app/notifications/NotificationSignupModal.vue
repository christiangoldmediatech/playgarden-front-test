<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-overlay
        :dark="false"
        :value="isNotificationSignupModalVisible"
        z-index="4000"
      >
        <v-btn :disabled="loading" icon>
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
        <v-row no-gutters>
          <v-card class="patch-earned">
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="3">
                  <v-img
                    v-if="$vuetify.breakpoint.smAndUp"
                    max-width="550"
                    :src="require('@/assets/svg/girl.svg')"
                  />
                </v-col>
                <v-col cols="9">
                  <v-row class="mx-4">
                    <div>
                      <underlined-title class="text-h6 text-md-h5" text="WE HOPE YOUR LITTLE ONE IS ENJOYING LEARNING WITH PLAYGARDEN PREP ONLINE!" />
                      <p class="mt-4 text-justify">
                        Your FREE TRIAL period will end on [May 5, 2021]. We would hate to see you miss out on this early education and development opportunity! So we are extending our introductory promotion so you can continue to have access to all the features of the PREMIUM EARLY EDUCATION plan.
                        Sign-up now and for $49.99 per month you will continue to have access to:
                      </p>
                      <ul class="info-card">
                        <li
                          class="register-item text-left"
                        >
                          <small class="text-trial">
                            1,000s of lessons
                          </small>
                        </li>
                        <li
                          class="register-item text-left"
                        >
                          <small class="text-trial">
                            Hours of Live Classes each week
                          </small>
                        </li>
                        <li
                          class="register-item text-left"
                        >
                          <small class="text-trial">
                            Special Events
                          </small>
                        </li>
                        <li
                          class="register-item text-left"
                        >
                          <small class="text-trial">
                            Educational Playdates
                          </small>
                        </li>
                      </ul>
                      <p class="mt-4 text-justify">
                        As always, you can cancel your enrollment anytime by going to your Accounts Page. We would love to hear from you if you have any questions, comments or concerns related to Playgarden Prep Online.
                      </p>
                      <p class="mt-4 text-justify">
                        With kind regards,<br>
                        Playgarden Prep Teachers.
                      </p>
                    </div>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-row>
      </v-overlay>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'

export default defineComponent({
  name: 'NotificationSignupModal',

  setup () {
    const { isNotificationSignupModalVisible, showNotificationSignupModal, hideNotificationSignuoModal } = useGlobalModal()
    return {
      isNotificationSignupModalVisible,
      showNotificationSignupModal,
      hideNotificationSignuoModal
    }
  }
})
</script>

<style lang="scss">
ul.info-card {
  list-style: none; /* Remove default bullets */
}
ul.info-card li::before {
  content: "●";
  font-size: 24px !important;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
  margin-top: 10px;
}
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
