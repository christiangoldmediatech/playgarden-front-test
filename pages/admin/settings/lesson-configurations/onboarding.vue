<template>
  <onboarding-data-table />
</template>

<script>
import OnboardingDataTable from '@/components/admin/onboarding/OnboardingDataTable.vue'

export default {
  name: 'Onboarding',

  layout: 'admin',

  components: {
    OnboardingDataTable
  }
}
</script>
