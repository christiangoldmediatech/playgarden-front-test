<template>
  <div>
    <large-image-content-dialog :value="show" :img="imagePath" @close="hideNotificationSignupModal">
      <div class="mt-8">
        <underlined-title class="text-h6 text-md-h5" text="WE HOPE YOUR LITTLE ONE IS ENJOYING LEARNING WITH PLAYGARDEN PREP ONLINE!" />
      </div>

      <v-row class="mx-1 mt-3">
        <div>
          <p class="mt-4 text-justify">
            Take advantage of the <span class="info-modal-notification">EARLY BIRD SPECIAL!</span> Sign up now to receive:
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
                @click="showSubscriptionPlanSelectionModal"
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
                @click="hideNotificationSignupModal"
              >
                Remind me Later
              </v-btn>
            </v-col>
            <v-col cols="12">
              <span class="grey--text">Need help? </span>
              <span class="text-decoration-underline">
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
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'

export default defineComponent({
  name: 'InfoWeek',

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
    const { hideNotificationSignupModal, showSubscriptionPlanSelectionModal } = useGlobalModal()

    return {
      hideNotificationSignupModal,
      showSubscriptionPlanSelectionModal
    }
  }
})
</script>

<style lang="scss" scoped>
.info-modal-notification {
  font-weight: bold !important;
  color: var(--v-primary-base) !important;
}
</style>
