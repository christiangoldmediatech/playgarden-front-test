<template>
  <onboarding-data-table ref="OnboardingDataTable" />
</template>

<script>
import OnboardingDataTable from '@/components/admin/onboarding/OnboardingDataTable.vue'

export default {
  name: 'Onboarding',

  layout: 'admin',

  components: {
    OnboardingDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.OnboardingDataTable.refresh()
  }
}
</script>
