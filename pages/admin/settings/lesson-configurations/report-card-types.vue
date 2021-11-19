<template>
  <report-card-types-data-table />
</template>

<script>
import ReportCardTypesDataTable from '@/components/admin/report-card/ReportCardTypesDataTable.vue'

export default {
  name: 'ReportCardTypes',

  layout: 'admin',

  components: {
    ReportCardTypesDataTable
  }
}
</script>
