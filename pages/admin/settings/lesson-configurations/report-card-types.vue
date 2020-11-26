<template>
  <report-card-types-data-table ref="ReportCardTypesDataTable" />
</template>

<script>
import ReportCardTypesDataTable from '@/components/admin/report-card/ReportCardTypesDataTable.vue'

export default {
  name: 'ReportCardTypes',

  layout: 'admin',

  components: {
    ReportCardTypesDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.ReportCardTypesDataTable.refresh()
  }
}
</script>
