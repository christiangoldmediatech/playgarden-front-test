<template>
  <offline-worksheet-category-data-table />
</template>

<script>
import OfflineWorksheetCategoryDataTable from '@/components/admin/offline-worksheet-categories/OfflineWorksheetCategoryDataTable.vue'

export default {
  name: 'OfflineWorksheetCategories',

  layout: 'admin',

  components: {
    OfflineWorksheetCategoryDataTable
  }
}
</script>
