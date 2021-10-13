<template>
  <div>
    <large-image-content-dialog :value="isTrialEndingWeekThreeModalVisible" :img="img" :is-closeable="true" @close="closeModal">
      <div>
        <underlined-title
          text="WE HOPE YOUR LITTLE ONE IS ENJOYING LEARNING WITH PLAYGARDEN PREP ONLINE!"
          font-size="32px"
          font-size-mobile="22px"
          letter-spacing="4.8px"
        />
      </div>

      <div class="grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
        <p>Take advantage of the <span class="font-weight-bold primary--text">EARLY BIRD SPECIAL!</span> Sign up now to receive:</p>
        <ol>
          <li>A Playgarden Prep backpack</li>
          <li>Specialized pencils</li>
          <li>The new workbook</li>
        </ol>
        <br>
        <p>
          As always, you can cancel your enrollment anytime by going to your Accounts Page.
          Please contact us with any questions about the plans, your enrollment or anything at all!
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
          <v-btn
            x-large
            color="accent"
            outlined
            class="text-none"
            width="250"
            @click="closeModal"
          >
            Remind me Later
          </v-btn>
        </v-col>

        <v-col cols="12" class="mx-0 mx-md-4 mt-4 mt-md-0 align-self-center font-weight-bold">
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
    img: require('@/assets/png/week-three-trial-ending.png')
  }),

  computed: {
    ...mapState('notifications', ['isTrialEndingWeekThreeModalVisible'])
  },

  methods: {
    closeModal () {
      this.$store.commit('notifications/SET_IS_TRIAL_ENDING_WEEK_THREE_MODAL_VISIBLE', false)
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
