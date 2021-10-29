<template>
  <faqs-category-data-table />
</template>

<script>
import FaqsCategoryDataTable from '@/components/admin/faqs-categories/FaqsCategoryDataTable'

export default {
  name: 'Categories',

  layout: 'admin',

  components: {
    FaqsCategoryDataTable
  }
}
</script>
