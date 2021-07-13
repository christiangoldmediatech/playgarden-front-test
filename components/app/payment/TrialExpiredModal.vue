<template>
  <div>
    <large-image-content-dialog :value="isTrialExpiredModalVisible" :img="girlRedRibbon" @close="closeModal">
      <div>
        <underlined-title
          text="YOUR TRIAL PERIOD HAS EXPIRED."
          font-size="32PX"
          font-size-mobile="22px"
          letter-spacing="4.8px"
        />
      </div>

      <div v-if="!!lastDayOfTrial" class="py-3">
        <span class="text-h6 grey--text text--darken-2">Your last day was: </span>
        <underlined-title
          :text="lastDayOfTrial"
          class="primary--text"
          line-color="rgba(194, 218, 165, 0.18)"
          :line-from="35"
          padding-bottom="30px"
        />
      </div>

      <div class="grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
        <p>We hope your little one has enjoyed learning with the Playgarden Prep teachers!</p>
        <p>
          During your trial period, which ended on {{ lastDayOfTrial }}, you were able to experience all the features of the HOMESCHOOL plan. After the trial period, you were automatically placed in the PREMIUM EDUCATION monthly plan. You can stay in that plan, or you can choose now in which plan you want little one to learn going forward by clicking the plans comparison button.
          As always, you cancel your enrollment anytime by going to your Accounts Page.
          Please contact us with any questions about the plans, your enrollment, or anything at all related to Playgarden Prep.
        </p>
        <p class="my-0">
          With kind regards,
        </p>
        <p>Playgarden Prep Teachers.</p>
      </div>

      <v-row no-gutters class="text-center text-md-left">
        <v-col cols="12" md="auto" class="my-4">
          <v-btn x-large color="accent" class="text-none" width="250" @click="handleComparePlans">
            Compare plans
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
import dayjs from 'dayjs'
import { mapState, mapGetters } from 'vuex'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'TrialExpiredModal',

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
    girlRedRibbon: require('@/assets/png/girl-red-ribbon.png'),
    isContactFormShowing: false
  }),

  computed: {
    ...mapState('notifications', ['isTrialExpiredModalVisible']),
    ...mapGetters('auth', ['getUserInfo']),

    // @ts-ignore
    lastDayOfTrial () {
      // @ts-ignore
      if (!this.getUserInfo.trialEnd) {
        return ''
      }

      // @ts-ignore
      return dayjs(this.getUserInfo.trialEnd).format('MMMM DD, YYYY')
    }
  },

  methods: {
    closeModal () {
      this.$store.commit('notifications/SET_TRIAL_EXPIRED_MODAL_VISIBLE', false)
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
