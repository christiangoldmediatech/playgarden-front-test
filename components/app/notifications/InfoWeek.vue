<template>
  <div>
    <large-image-content-dialog :value="show" :img="imagePath" @close="hideNotificationSignupModal">
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
          <p class="mt-4 text-justify text-justify grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
            Take advantage of the <span class="info-modal-notification">EARLY BIRD SPECIAL!</span> Sign up now to receive:
          </p>

          <ol class="mt-4 text-justify text-justify grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
            <li value="1">
              A Playgarden Prep backpack.
            </li>

            <li>Specialized pencils.</li>

            <li> The new workbook.</li>
          </ol>

          <p class="mt-4 text-justify text-justify grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
            As always, you can cancel your enrollment anytime by going to your Accounts Page.
            Please contact us with any questions about the plans, your enrollment, or anything at all!
          </p>
          <p class="mt-4 text-justify text-justify grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
            With kind regards,<br>
            Playgarden Prep Teachers.
          </p>

          <v-row no-gutters class="text-center text-md-left">
            <v-col cols="12" md="auto" class="my-4">
              <v-btn x-large color="accent" class="text-none" width="250" @click="goPlan">
                Subscribe Now
              </v-btn>
            </v-col>
            <v-col cols="12" md="auto" class="my-4 ml-4">
              <v-btn
                x-large
                color="white"
                class="btn-accent text-none"
                width="250"
                @click="hideNotificationSignupModal"
              >
                Remind me Later
              </v-btn>
            </v-col>

            <v-col cols="12" md="12" class="mx-0 mx-md-4 align-self-center font-weight-bold">
              <span class="grey--text">Need help? </span>
              <span class="text-decoration-underline" @click="goContacUs">
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
    const store = useStore<TypedStore>()
    const { hideNotificationSignupModal } = useGlobalModal({ store })

    return {
      hideNotificationSignupModal
    }
  },
  methods: {
    goPlan () {
      this.hideNotificationSignupModal()
      this.$router.push({
        name: 'app-payment-plan'
      })
    },
    goContacUs () {
      this.hideNotificationSignupModal()
      this.$router.push({
        name: 'help'
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.info-modal-notification {
  font-weight: bold !important;
  color: var(--v-primary-base) !important;
}

.btn-accent {
  color: var(--v-accent-base) !important;
  border: 1px solid var(--v-accent-base) !important;
}

</style>
