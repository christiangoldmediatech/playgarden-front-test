<template>
  <v-row no-gutters>
    <v-col cols="12" md="6" class="pr-md-8 mb-10 mb-md-0">
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

    <v-col v-if="!isUserCaregiver" cols="12" md="6" class="pl-md-8 mb-12 mb-sm-0">
      <!-- Desktop Title -->
      <div class="d-none d-md-block text-uppercase font-weight-bold text-h4 grey--text text--darken-2 pb-6">
        Shipping Address
      </div>
      <v-card class="pa-4 pa-sm-8 card-custom-border">
        <!-- SVG AND TITLE -->
        <!-- DESKTOP -->
        <div class="justify-center pb-4 d-none d-sm-flex">
          <img
            height="100px"
            src="@/assets/svg/shipping-address.svg"
          >
        </div>

        <!-- MOBILE -->
        <div class="d-flex d-sm-none justify-center py-2">
          <img
            height="45px"
            src="@/assets/svg/shipping-address.svg"
          >
          <span class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mt-1 ml-2">
            Shipping Address
          </span>
        </div>

        <v-fade-transition mode="out-in">
          <!-- LOADING -->
          <div v-if="isLoading" class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
            />
          </div>

          <!-- SHIPPING ADDRESS IS PRESENT -->
          <div v-else-if="isShippingAddressFormVisible" key="shipping-address-present">
            <div class="text-center body-1 text-md-h6 font-weight-medium grey--text text--darken-2 my-2">
              <small>We use this information to send you Playgarden Prep educational materials.</small>
            </div>

            <shipping-address-details
              :edit-by-default="isEditingShippingAddress"
              @shipping-address-cancel="checkShippingAddress"
              @shipping-address-saved="checkShippingAddress"
            />
          </div>

          <!-- SHIPPING ADDRESS IS REQUIRED TO SEND WELCOME KIT -->
          <div v-else key="shipping-address-required">
            <div v-if="isUserInTrial" class="text-center">
              <underlined-title
                text="WE WANT TO SEND YOU A PLAYGARDEN PREP WORKBOOK"
                font-size="24px"
                font-size-mobile="12px"
              />
            </div>

            <p v-if="isUserInTrial" class="text-center pg-text-[20px] mt-4">
              In order to receive your FREE A-D workbook, please provide your shipping address here.
            </p>
            <p v-else class="text-center pg-text-[20px] mt-4">
              Please enter your shipping address
            </p>

            <v-btn x-large block color="primary" class="mt-7" @click="showShippingAddressForm">
              ADD SHIPPING ADDRESS
            </v-btn>

            <p v-if="isUserInTrial" class="mt-7 pg-text-[14px]">
              *In the territorial US and Canada only.
            </p>
          </div>
        </v-fade-transition>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

import GeneralInfo from '@/components/app/user/GeneralInfo.vue'
import ShippingAddressDetails from '@/components/app/payment/ShippingAddressDetails.vue'
import { defineComponent, onMounted, ref, useRoute } from '@nuxtjs/composition-api'
import { useShippingAddress, useSnotifyHelper } from '@/composables'

export default defineComponent({
  name: 'Index',

  components: {
    GeneralInfo,
    ShippingAddressDetails
  },

  setup () {
    const route = useRoute()
    const ShippingAddress = useShippingAddress()
    const isEditingShippingAddress = ref(false)
    const isShippingAddressFormVisible = ref(false)
    const isLoading = ref(true)
    const snotify = useSnotifyHelper()

    onMounted(() => {
      handleRouteAction()
      checkShippingAddress()
    })

    async function checkShippingAddress () {
      try {
        isLoading.value = true
        isShippingAddressFormVisible.value = Boolean(await ShippingAddress.getShippingAdress())
      } catch (error) {
        snotify.error('Error checking shipping address', error)
      } finally {
        isLoading.value = false
      }
    }

    function showShippingAddressForm () {
      isEditingShippingAddress.value = true
      isShippingAddressFormVisible.value = true
    }

    function handleRouteAction () {
      const action = route.value.query.action

      switch (action) {
        case 'edit-shipping':
          isEditingShippingAddress.value = true
          break
        default:
          break
      }
    }

    return {
      isLoading,
      isEditingShippingAddress,
      isShippingAddressFormVisible,
      showShippingAddressForm,
      checkShippingAddress
    }
  },

  computed: {
    ...mapGetters('auth', ['isUserCaregiver', 'isUserInTrial'])
  }
})
</script>

<style lang="scss" scoped>
.card-custom-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}

.pg-text-\[20px\] {
  font-size: 20px;
}

.pg-text-\[14px\] {
  font-size: 14px;
}
</style>
