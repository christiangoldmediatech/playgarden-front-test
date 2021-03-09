<template>
  <v-row no-gutters>
    <v-col cols="12" md="6" class="pr-sm-8 mb-10 mb-sm-0">
      <!-- Desktop Title -->
      <div class="pg-title--uppercase pb-12 d-none d-sm-block">
        General Info
      </div>
      <v-card class="pa-4 pa-sm-8 detail-card">
        <!-- Desktop SVG -->
        <div class="justify-center pb-8 d-none d-sm-flex">
          <img
            height="154px"
            src="@/assets/svg/general-info.svg"
          >
        </div>

        <!-- Mobile SVG and Title= -->
        <div class="d-flex d-sm-none justify-center py-4">
          <img
            height="44px"
            src="@/assets/svg/general-info.svg"
          >
          <span class="text-uppercase font-weight-bold text-h5 mt-1 ml-2 grey-title">
            General Info
          </span>
        </div>

        <general-info />
      </v-card>
    </v-col>

    <v-col v-if="!isUserCaregiver" cols="12" md="6" class="pl-sm-8 mb-12 mb-sm-0">
      <!-- Desktop Title -->
      <div class="pg-title--uppercase pb-12 d-none d-sm-flex">
        Shipping Address
      </div>
      <v-card class="pa-4 pa-sm-8 detail-card">
        <!-- Desktop SVG -->
        <div class="justify-center pb-8 d-none d-sm-flex">
          <img
            height="154px"
            src="@/assets/svg/shipping-address.svg"
          >
        </div>

        <!-- Mobile SVG and Title -->
        <div class="d-flex d-sm-none justify-center py-4">
          <img
            height="44px"
            src="@/assets/svg/shipping-address.svg"
          >
          <span class="text-uppercase font-weight-bold text-h5 mt-1 ml-2 grey-title">
            Shipping Address
          </span>
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
.grey-title {
  color: #606060;
}

.detail-card {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}
</style>
