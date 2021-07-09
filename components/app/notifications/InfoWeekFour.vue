<template>
  <div>
    <large-image-content-dialog :value="true" :img="imagePath" @close="hideNotificationSignupModal">
      <div>
        <underlined-title
          text="WE HOPE YOUR LITTLE ONE IS ENJOYING LEARNING WITH PLAYGARDEN PREP ONLINE!"
          font-size="32PX"
          font-size-mobile="22px"
          letter-spacing="4.8px"
        />
      </div>

      <v-row class="mx-1 mt-3">
        <div>
          <p class="mt-4 text-justify grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
            Your <span class="info-modal-notification">FREE TRIAL</span> period will end on [May 5, 2021].
            We would hate to see you miss out on this early education and development opportunity!
            So we are extending our <span class="info-modal-notification">INTRODUCTORY PROMOTION</span> so you can continue to have access
            to all the features of the <span class="font-weight-bold">PREMIUM EARLY EDUCATION</span> plan.
            Sign-up now and for <span class="font-weight-bold">$49.99 per month</span> you will continue to have access to:
          </p>
          <ul class="info-card grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
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
          <p class="mt-4 text-justify grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
            As always, you can cancel your enrollment anytime by going to your Accounts Page. We would love to hear from you if you have any questions, comments or concerns related to Playgarden Prep Online.
          </p>
          <p class="mt-4 text-justify grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
            With kind regards,<br>
            Playgarden Prep Teachers.
          </p>
          <v-row no-gutters class="text-center text-md-left">
            <v-col cols="12" md="auto" class="my-4">
              <v-btn x-large color="accent" class="text-none" width="250" @click="showSubscriptionPlanSelectionModal">
                Subscribe Now
              </v-btn>
            </v-col>
            <v-col cols="12" md="auto" class="mx-0 mx-md-4 align-self-center font-weight-bold">
              <span class="grey--text">Need help? </span>
              <span class="text-decoration-underline" @click="handleContactUs">
                <a class="accent--text">Contact us</a>
              </span>
            </v-col>
          </v-row>
        </div>
      </v-row>
    </large-image-content-dialog>
  </div>
</template>

<script lang="ts">
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'InfoWeekFour',
  props: {
    imagePath: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  components: {
    LargeImageContentDialog
  },
  setup () {
    const store = useStore<TypedStore>()
    const { hideNotificationSignupModal, showSubscriptionPlanSelectionModal } = useGlobalModal({ store })

    return {
      hideNotificationSignupModal,
      showSubscriptionPlanSelectionModal
    }
  },
  methods: {}
})
</script>

<style lang="scss" scoped>
ul.info-card {
  list-style: none; /* Remove default bullets */
  font-family: "Poppins" !important;
}
ul.info-card li::before {
  content: "●";
  font-size: 24px !important;
  font-family: "Poppins" !important;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
  margin-top: 10px;
}

.info-modal-notification {
  font-weight: bold !important;
  color: var(--v-primary-base) !important;
}
</style>
