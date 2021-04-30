<template>
  <large-image-content-dialog :value="isShippingModalVisible" :img="girlFamilyTreeImg" @close="closeModal">
    <div>
      <underlined-title
        text="Do you want to receive the  Playgarden Prep workbook at home, for FREE?"
        font-size="46px"
        font-size-mobile="22px"
        letter-spacing="4.8px"
      />
    </div>

    <div class="text-uppercase font-weight-bold text-h6 text-md-h4 grey--text text--darken-2 mt-6 mt-md-10">
      Shipping Address
    </div>

    <div class="grey--text text--darken-2 caption text-md-body-2 my-3 my-md-6">
      We want to send you our school materials, for FREE, so your little one gets the most out learning with us in this TRIAL period. Enter your address below and you should receive the Playgarden Prep workbook and specialized pencils in a couple of days!
    </div>

    <shipping-address-details
      edit-by-default
      save-button-text="Send"
      save-button-color="primary"
      hide-cancel-button-text="REMIND ME LATER"
      show-phone-number-field
      wrap-state-and-zip-code-fields
      @shipping-address-saved="closeModal"
      @shipping-address-cancel="closeModal"
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
