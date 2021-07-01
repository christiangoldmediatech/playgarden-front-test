<template>
  <div>
    <large-image-content-dialog :value="isTrialExpiredModalVisible" :img="imagePath" @close="closeModal">
      <div>
        <underlined-title class="text-h6 text-md-h5" text="WE HOPE YOUR LITTLE ONE IS ENJOYING LEARNING WITH PLAYGARDEN PREP ONLINE!" />
      </div>

      <v-row class="mx-1 mt-3">
        <div>
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
            <v-col cols="3">
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
    </large-image-content-dialog>
  </div>
</template>

<script lang="ts">
import { mapState, mapGetters } from 'vuex'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'InfoWeekThree',

  components: {
    LargeImageContentDialog
  },

  data: () => ({
    isTrialExpiredModalVisible: true,
    imagePath: require('@/assets/svg/children-play.svg')
  }),

  methods: {
    closeModal () {
      this.$store.commit('notifications/SET_TRIAL_EXPIRED_MODAL_VISIBLE', false)
    }
  }
})
</script>
