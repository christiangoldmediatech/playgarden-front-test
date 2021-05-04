<template>
  <plan-data-table ref="planDataTableRef" />
</template>

<script>
import PlanDataTable from '@/components/admin/plans/PlanDataTable.vue'

export default {
  name: 'PlanManagement',

  layout: 'admin',

  components: {
    PlanDataTable
  },

  mounted () {
    this.$refs.planDataTableRef.refresh()
  }
}
</script>
