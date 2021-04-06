<template>
  <v-row no-gutters>
    <v-col cols="12" md="6" class="pr-sm-8 mb-10 mb-sm-0">
      <!-- Desktop Title -->
      <div class="d-none d-md-block text-uppercase font-weight-bold text-h4 grey--text text--darken-2 pb-6">
        General Info
      </div>
      <v-card class="pa-4 pa-sm-8 card-custom-border">
        <!-- Desktop SVG -->
        <div class="justify-center pb-4 d-none d-sm-flex">
          <img
            height="100px"
            src="@/assets/svg/general-info.svg"
          >
        </div>

        <!-- Mobile SVG and Title= -->
        <div class="d-flex d-sm-none justify-center py-2">
          <img
            height="45px"
            src="@/assets/svg/general-info.svg"
          >
          <span class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mt-1 ml-2">
            General Info
          </span>
        </div>

        <div class="text-center body-1 text-md-h6 font-weight-medium grey--text text--darken-2 py-2">
          <small>Manage your personal information.</small>
        </div>

        <general-info />
      </v-card>
    </v-col>

    <v-col v-if="!isUserCaregiver" cols="12" md="6" class="pl-sm-8 mb-12 mb-sm-0">
      <!-- Desktop Title -->
      <div class="d-none d-md-block text-uppercase font-weight-bold text-h4 grey--text text--darken-2 pb-6">
        Shipping Address
      </div>
      <v-card class="pa-4 pa-sm-8 card-custom-border">
        <!-- Desktop SVG -->
        <div class="justify-center pb-4 d-none d-sm-flex">
          <img
            height="100px"
            src="@/assets/svg/shipping-address.svg"
          >
        </div>

        <!-- Mobile SVG and Title -->
        <div class="d-flex d-sm-none justify-center py-2">
          <img
            height="45px"
            src="@/assets/svg/shipping-address.svg"
          >
          <span class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mt-1 ml-2">
            Shipping Address
          </span>
        </div>

        <div class="text-center body-1 text-md-h6 font-weight-medium grey--text text--darken-2 my-2">
          <small>We use this information to send you Playgarden Prep educational materials.</small>
        </div>

        <shipping-address-details />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import GeneralInfo from '@/components/app/user/GeneralInfo'
import ShippingAddressDetails from '@/components/app/payment/ShippingAddressDetails'

export default {
  name: 'Index',

  components: {
    GeneralInfo,
    ShippingAddressDetails
  },

  computed: {
    ...mapGetters('auth', ['isUserCaregiver'])
  }
}
</script>

<style lang="scss" scoped>
.card-custom-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}
</style>
