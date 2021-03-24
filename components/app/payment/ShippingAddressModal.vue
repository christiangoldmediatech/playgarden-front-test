<template>
  <pg-dialog persistent :fullscreen="isMobile" :value="isShippingModalVisible" max-width="1400px">
    <v-card :class="{ 'border-16': !isMobile }">
      <v-row no-gutters>
        <v-col cols="4" class="d-none d-md-block">
          <v-img height="100%" :src="girlFamilyTreeImg" class="border-left-16" />
        </v-col>
        <v-col cols="12" md="8" class="my-6 my-md-14 px-6">
          <!-- Desktop Close Button -->
          <v-btn class="d-none d-md-inline float-right" icon @click="closeModal">
            <v-icon size="32">
              mdi-close
            </v-icon>
          </v-btn>

          <!-- Mobile Close Button -->
          <v-btn class="d-md-none warning--text mb-4 pl-0" text @click="closeModal">
            <v-icon left>
              mdi-arrow-left
            </v-icon>
            Back
          </v-btn>

          <div>
            <underlined-title
              text="WE WANT TO SEND YOU A WELCOME KIT!"
              font-size="48px"
              font-size-mobile="22px"
              letter-spacing="4.8px"
            />
          </div>

          <div class="text-uppercase font-weight-bold text-h6 text-md-h4 grey--text text--darken-2 mt-6 mt-md-10">
            Shipping Address
          </div>

          <div class="grey--text text--darken-2 caption text-md-body-2 my-3 my-md-6">
            For our PREMIUM and PREMIUM PLUS plans, we require a shipping address in order to send the Welcome Kit with Backpack, workbooks, and additional materials so you can easily receive them at the comfort of your home.
          </div>

          <shipping-address-details
            edit-by-default
            save-button-text="Send"
            save-button-color="primary"
            hide-cancel-button
            wrap-state-and-zip-code-fields
            @shipping-address-saved="closeModal"
          />
        </v-col>
      </v-row>
    </v-card>
  </pg-dialog>
</template>

<script>
import { mapState } from 'vuex'
import ShippingAddressDetails from '@/components/app/payment/ShippingAddressDetails'

export default {
  name: 'ShippingAddressModal',

  components: {
    ShippingAddressDetails
  },

  data: () => ({
    girlFamilyTreeImg: require('@/assets/png/girl-family-tree.png')
  }),

  computed: {
    ...mapState('notifications', ['isShippingModalVisible']),

    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  },

  methods: {
    closeModal () {
      this.$store.commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', false)
    }
  }
}
</script>

<style scoped>
.border-left-16 {
  border-radius: 16px 0px 0px 16px !important;
}

.border-16 {
  border-radius: 16px !important;
}

.float-right {
  float: right;
}
</style>
