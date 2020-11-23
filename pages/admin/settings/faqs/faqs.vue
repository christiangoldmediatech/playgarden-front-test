<template>
  <faqs-data-table ref="FaqsDataTable" />
</template>

<script>
import FaqsDataTable from '@/components/admin/faqs/FaqsDataTable'

export default {
  name: 'Faqs',

  layout: 'admin',

  components: {
    FaqsDataTable
  },

  mounted () {
    this.$refs.FaqsDataTable.refresh()
  }
}
</script>
