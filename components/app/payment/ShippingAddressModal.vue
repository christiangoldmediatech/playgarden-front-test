<template>
  <large-image-content-dialog
    :value="isShippingModalVisible"
    :img="girlFamilyTreeImg"
    :image-height="'500px'"
    @close="dontShowAgain"
  >
    <div class="text-center">
      <underlined-title
        text="We want to send you a Playgarden Prep workbook!"
        font-size="46px"
        font-size-mobile="22px"
        letter-spacing="4.8px"
      />
    </div>

    <div class="grey--text text--darken-2 text-md-h5 my-3 my-md-6 text-center">
      In order to receive your FREE A-D workbook, please provide your shipping
      address by going to your Accounts Page
      <nuxt-link
        class="accent--text font-weight-bold text-decoration-underline"
        :to="{ name: 'app-account-index' }"
      >
        HERE
      </nuxt-link>.
    </div>

    <div class="d-flex flex-column justify-center align-center">
      <v-btn
        color="secondary"
        class="my-3"
        x-large
        :width="isMobile ? '90%' : '500px'"
        @click="closeModal"
      >
        REMIND ME LATER
      </v-btn>

      <v-btn
        color="accent"
        text
        x-large
        class="mb-3 text-decoration-underline"
        :width="isMobile ? '90%' : '500px'"
        @click="dontShowAgain"
      >
        DON'T SHOW ME THIS AGAIN
      </v-btn>

      <div class="grey--text text--darken-2">
        *Limited to 1 introductory learning package per family, in the
        territorial US and Canada only.
      </div>
    </div>
  </large-image-content-dialog>
</template>

<script>
import { mapState } from 'vuex'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'

export default {
  name: 'ShippingAddressModal',

  components: {
    LargeImageContentDialog
  },

  data: () => ({
    girlFamilyTreeImg: require('@/assets/png/girl-family-tree.png')
  }),

  computed: {
    ...mapState('notifications', ['isShippingModalVisible']),

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    }
  },

  methods: {
    dontShowAgain() {
      this.$store.commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', false)
      this.$store.dispatch('notifications/showShippingAddressModalAgain', false)
    },

    closeModal() {
      this.$store.commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', false)
      this.$store.dispatch('notifications/showShippingAddressModalAgain', true)
    }
  }
}
</script>
