<template>
  <plan-data-table ref="PlanDataTable" />
</template>

<script>
import PlanDataTable from '@/components/admin/plans/PlanDataTable.vue'

export default {
  name: 'PlanManagement',

  layout: 'admin',

  components: {
    PlanDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.PlanDataTable.refresh()
  }
}
</script>
