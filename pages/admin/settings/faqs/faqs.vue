<template>
  <faqs-data-table />
</template>

<script>
import FaqsDataTable from '@/components/admin/faqs/FaqsDataTable'

export default {
  name: 'Faqs',

  layout: 'admin',

  components: {
    FaqsDataTable
  }
}
</script>
