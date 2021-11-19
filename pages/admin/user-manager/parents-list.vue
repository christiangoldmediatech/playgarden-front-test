<template>
  <parents-data-table />
</template>

<script>
import ParentsDataTable from '@/components/admin/parents/ParentsDataTable.vue'

export default {
  name: 'ParentsList',

  layout: 'admin',

  components: {
    ParentsDataTable
  }
}
</script>
