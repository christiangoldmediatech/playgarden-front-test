<template>
  <div>
    <large-image-content-dialog :value="isTrialExpiredModalVisible" :img="imagePath" @close="closeModal">
      <div>
        <underlined-title class="text-h6 text-md-h5" text="WE HOPE YOUR LITTLE ONE IS ENJOYING LEARNING WITH PLAYGARDEN PREP ONLINE!" />
      </div>

      <v-row class="mx-1 mt-3">
        <div>
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
          <v-row>
            <v-col cols="3">
              <v-btn
                block
                color="accent"
                small
                type="submit"
              >
                Subscribe Now
              </v-btn>
            </v-col>
            <v-col>
              <span class="grey--text">Need help? </span>
              <span class="text-decoration-underline" @click="showContactUsModal">
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
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'InfoWeekFour',

  components: {
    LargeImageContentDialog
  },

  data: () => ({
    isTrialExpiredModalVisible: true,
    imagePath: require('@/assets/svg/girl.svg')
  }),

  methods: {
    closeModal () {
      this.$store.commit('notifications/SET_TRIAL_EXPIRED_MODAL_VISIBLE', false)
    }
  }
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
</style>
