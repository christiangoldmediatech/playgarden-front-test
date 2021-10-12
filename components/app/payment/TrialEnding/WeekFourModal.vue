<template>
  <div>
    <large-image-content-dialog :value="isTrialEndingWeekFourModalVisible" :img="img" :is-closeable="true" @close="closeModal">
      <div>
        <underlined-title
          text="WE HOPE YOUR LITTLE ONE IS ENJOYING LEARNING WITH PLAYGARDEN PREP ONLINE!"
          font-size="32px"
          font-size-mobile="22px"
          letter-spacing="4.8px"
        />
      </div>

      <div class="grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
        <p>
          Your <span class="font-weight-bold primary--text">FREE TRIAL</span> period will end on {{ x }}. We would hate to see you miss out on this early education and development opportunity!
          So we are extending our <span class="font-weight-bold primary--text">INTRODUCTORY</span> promotion so you can continue to have access to all the features of the <b>PRESCHOOL @HOME</b> plan.
        </p>
        <p>Sign-up now and for <b>$69.99</b> per month you will continue to have access to:</p>
        <ul>
          <li>1,000s of lessons</li>
          <li>Hours of Live Clases each week</li>
          <li>Educational Playdates</li>
        </ul>
        <br>
        <p>
          As always, you can cancel your enrollment anytime by going to your Accounts Page.
          We would love to hear from you if you have any questions, comments or concerns related to Playgarden Prep Online.
        </p>
        <p class="my-0">
          With kind regards,
        </p>
        <p>Playgarden Prep Teachers.</p>
      </div>

      <v-row no-gutters class="text-center text-md-left">
        <v-col cols="12" md="auto" class="my-4">
          <v-btn x-large color="accent" class="text-none" width="250" @click="handleComparePlans">
            Subscribe now
          </v-btn>
        </v-col>

        <v-col cols="12" md="auto" class="mx-0 mx-md-4 align-self-center font-weight-bold">
          <span class="grey--text">Need help? </span>
          <span class="text-decoration-underline" @click="handleContactUs">
            <a class="accent--text">Contact us</a>
          </span>
        </v-col>
      </v-row>
    </large-image-content-dialog>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'
import { TypedStore } from '@/models'
export default defineComponent({
  name: 'WeekThreeModal',
  components: {
    LargeImageContentDialog
  },
  setup () {
    const store = useStore<TypedStore>()
    const { showContactUsModal } = useGlobalModal({ store })
    return {
      showContactUsModal
    }
  },
  data: () => ({
    img: require('@/assets/png/week-four-trial-ending.png')
  }),
  computed: {
    ...mapState('notifications', ['isTrialEndingWeekFourModalVisible'])
  },
  methods: {
    closeModal () {
      this.$store.commit('notifications/SET_IS_TRIAL_ENDING_WEEK_FOUR_MODAL_VISIBLE', false)
    },
    handleComparePlans () {
      this.closeModal()
      this.$router.push({ name: 'app-payment-plan' })
    },
    handleContactUs () {
      this.closeModal()
      this.showContactUsModal()
    }
  }
})
</script>
