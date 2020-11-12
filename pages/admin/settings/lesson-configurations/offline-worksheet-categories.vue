<template>
  <offline-worksheet-category-data-table ref="OfflineWorksheetCategoryDataTable" />
</template>

<script>
import OfflineWorksheetCategoryDataTable from '@/components/admin/offline-worksheet-categories/OfflineWorksheetCategoryDataTable.vue'

export default {
  name: 'OfflineWorksheetCategories',

  layout: 'admin',

  components: {
    OfflineWorksheetCategoryDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.OfflineWorksheetCategoryDataTable.refresh()
  }
}
</script>
