<template>
  <specialists-data-table />
</template>

<script>
import SpecialistsDataTable from '@/components/admin/specialists/SpecialistsDataTable.vue'

export default {
  name: 'SpecialistsManagement',

  layout: 'admin',

  components: {
    SpecialistsDataTable
  }
}
</script>
