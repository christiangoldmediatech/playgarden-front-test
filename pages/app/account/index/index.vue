<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" md="6" class="pr-0 pr-md-4 mb-8">
        <general-info-card />
        <shipping-address-card class="mt-8" />
        <student-profile-card class="mt-8" />
        <caregivers-card class="mt-8" />
      </v-col>
      <v-col cols="12" md="6" class="pl-0 pl-md-4">
        <membership-card />
        <notifications-card class="mt-8" />
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
import NotificationsCard from '@/components/app/account-dashboard/NotificationsCard.vue'

export default defineComponent({
  name: 'Index',
  components: {
    GeneralInfoCard,
    ShippingAddressCard,
    StudentProfileCard,
    CaregiversCard,
    MembershipCard,
    NotificationsCard
  },
  setup() {

  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';
</style>
