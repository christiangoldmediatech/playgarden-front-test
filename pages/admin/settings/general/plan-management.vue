<template>
  <plan-data-table />
</template>

<script>
import PlanDataTable from '@/components/admin/plans/PlanDataTable.vue'

export default {
  name: 'PlanManagement',

  layout: 'admin',

  components: {
    PlanDataTable
  }
}
</script>
