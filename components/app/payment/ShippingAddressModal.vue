<template>
  <large-image-content-dialog :value="isShippingModalVisible" :img="girlFamilyTreeImg" @close="closeModal">
    <div>
      <underlined-title
        text="WE WANT TO SEND YOU A WELCOME KIT!"
        font-size="46px"
        font-size-mobile="22px"
        letter-spacing="4.8px"
      />
    </div>

    <div class="text-uppercase font-weight-bold text-h6 text-md-h4 grey--text text--darken-2 mt-6 mt-md-10">
      Shipping Address
    </div>

    <div class="grey--text text--darken-2 caption text-md-body-2 my-3 my-md-6">
      For our PREMIUM and PREMIUM PLUS plans, we require a shipping address in order to send the Welcome Kit with our first Workbook. Fill out the information below so you can start learning from the comfort of your home.
    </div>

    <shipping-address-details
      edit-by-default
      save-button-text="Send"
      save-button-color="primary"
      show-phone-number-field
      hide-cancel-button
      wrap-state-and-zip-code-fields
      @shipping-address-saved="closeModal"
    />
  </large-image-content-dialog>
</template>

<script>
import { mapState } from 'vuex'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import ShippingAddressDetails from '@/components/app/payment/ShippingAddressDetails'

export default {
  name: 'ShippingAddressModal',

  components: {
    LargeImageContentDialog,
    ShippingAddressDetails
  },

  data: () => ({
    girlFamilyTreeImg: require('@/assets/png/girl-family-tree.png')
  }),

  computed: {
    ...mapState('notifications', ['isShippingModalVisible'])
  },

  methods: {
    closeModal () {
      this.$store.commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', false)
    }
  }
}
</script>
