<template>
  <faqs-category-data-table ref="FaqsCategoryDataTable" />
</template>

<script>
import FaqsCategoryDataTable from '@/components/admin/faqs-categories/FaqsCategoryDataTable'

export default {
  name: 'Categories',

  layout: 'admin',

  components: {
    FaqsCategoryDataTable
  },

  mounted () {
    this.$refs.FaqsCategoryDataTable.refresh()
  }
}
</script>
