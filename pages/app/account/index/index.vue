<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="6" class="pr-4">
        <general-info-card />
        <shipping-address-card class="mt-8" />
        <student-profile-card class="mt-8" />
        <caregivers-card class="mt-8" />
      </v-col>
      <v-col cols="6" class="pl-4">
        <membership-card />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import GeneralInfoCard from '@/components/app/account-dashboard/GeneralInfoCard.vue'
import ShippingAddressCard from '@/components/app/account-dashboard/ShippingAddressCard.vue'
import StudentProfileCard from '@/components/app/account-dashboard/StudentProfileCard.vue'
import CaregiversCard from '@/components/app/account-dashboard/CaregiversCard.vue'
import MembershipCard from '@/components/app/account-dashboard/MembershipCard.vue'

export default defineComponent({
  name: 'Index',
  components: {
    GeneralInfoCard,
    ShippingAddressCard,
    StudentProfileCard,
    CaregiversCard,
    MembershipCard
  },
  setup() {

  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';
</style>
